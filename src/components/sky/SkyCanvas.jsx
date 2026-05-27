import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadStars } from "../../lib/stars";
import { loadConstellations } from "../../lib/constellations";
import { createStarField } from "./createStarField";
import { createConstellationLayer } from "./createConstellationLayer";
import { createHorizon } from "./createHorizon";
import {
  equatorialToHorizontalQuaternion,
  equatorialToVec3,
  altAzFromVec3,
} from "../../lib/celestial";
import { useObserverStore } from "../../store/observerStore";
import { useSelectionStore } from "../../store/selectionStore";

function SkyCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let starField = null;
    let constLayer = null;

    // === Scene / Camera / Renderer ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 0.001);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // === OrbitControls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = 0.01;
    controls.maxPolarAngle = Math.PI - 0.01;

    // === 휠 → FOV 줌 ===
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 2;
      camera.fov = THREE.MathUtils.clamp(camera.fov + delta, 30, 90);
      camera.updateProjectionMatrix();
    };
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    // === 지평선 (월드 고정) ===
    const horizon = createHorizon();
    scene.add(horizon.group);

    // === 천구 그룹 (별 + 별자리가 함께 회전) ===
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    // === 관측자/시간 → 그룹 회전 ===
    const applyRotation = () => {
      const { observer, timeMs } = useObserverStore.getState();
      const rotation = equatorialToHorizontalQuaternion(
        new Date(timeMs),
        observer.lat,
        observer.lon,
      );
      celestialGroup.quaternion.copy(rotation);
    };
    applyRotation();
    const unsubObserver = useObserverStore.subscribe(applyRotation);

    // === 선택 → 하이라이트 ===
    const unsubSelection = useSelectionStore.subscribe((state) => {
      if (constLayer) constLayer.setHighlight(state.selectedConstellation);
    });

    // === 클릭(드래그 아님) → 별자리 선택 ===
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = null;

    const onPointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e) => {
      if (!downPos) return;
      const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      downPos = null;
      if (moved > 6) return; // 드래그로 간주 → 선택 안 함
      if (!constLayer) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      celestialGroup.updateMatrixWorld(); // 최신 회전 반영
      raycaster.setFromCamera(pointer, camera);
      const id = constLayer.raycast(raycaster);
      useSelectionStore.getState().setSelectedConstellation(id); // 빈 곳 클릭 시 null → 선택 해제
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // === 별 로드 ===
    loadStars()
      .then(({ meta, stars }) => {
        if (disposed) return;
        starField = createStarField(stars, { magLimit: meta.magLimit });
        celestialGroup.add(starField.points);
      })
      .catch((err) => console.error("[Stargazer] 별 로드 실패:", err));

    // === 별자리 레이어 로드 ===
    loadConstellations()
      .then(({ meta, constellations }) => {
        if (disposed) return;
        constLayer = createConstellationLayer(constellations);
        celestialGroup.add(constLayer.group);
        // 로드 시점의 선택 상태 반영
        constLayer.setHighlight(
          useSelectionStore.getState().selectedConstellation,
        );
        console.log(`[Stargazer] ${meta.count}개 별자리 인터랙션 준비`);
      })
      .catch((err) => console.error("[Stargazer] 별자리 로드 실패:", err));

    // === Resize ===
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // === Animation ===
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // === Cleanup ===
    return () => {
      disposed = true;
      unsubObserver();
      unsubSelection();
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      scene.remove(horizon.group);
      horizon.dispose();
      if (starField) {
        celestialGroup.remove(starField.points);
        starField.dispose();
      }
      if (constLayer) {
        celestialGroup.remove(constLayer.group);
        constLayer.dispose();
      }
      scene.remove(celestialGroup);
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SkyCanvas;
