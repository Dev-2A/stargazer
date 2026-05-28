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

    // === 천구 그룹 ===
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    // === 별 하이라이트 링 (선택 시 표시, 천구와 함께 회전) ===
    const ringCanvas = document.createElement("canvas");
    ringCanvas.width = ringCanvas.height = 128;
    const rctx = ringCanvas.getContext("2d");
    rctx.strokeStyle = "#9ecbff";
    rctx.lineWidth = 7;
    rctx.beginPath();
    rctx.arc(64, 64, 48, 0, Math.PI * 2);
    rctx.stroke();
    const ringTex = new THREE.CanvasTexture(ringCanvas);
    ringTex.colorSpace = THREE.SRGBColorSpace;
    const ringMat = new THREE.SpriteMaterial({
      map: ringTex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const starRing = new THREE.Sprite(ringMat);
    starRing.scale.set(4, 4, 1);
    starRing.visible = false;
    celestialGroup.add(starRing);

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

    // === 선택 → 하이라이트 (별자리 선 + 별 링) ===
    const unsubSelection = useSelectionStore.subscribe((state) => {
      if (constLayer) constLayer.setHighlight(state.selectedConstellation);
      if (state.selectedStar) {
        const v = equatorialToVec3(
          state.selectedStar.ra,
          state.selectedStar.dec,
          99,
        );
        starRing.position.set(v.x, v.y, v.z);
        starRing.visible = true;
      } else {
        starRing.visible = false;
      }
    });

    // === 클릭 → 별 우선, 없으면 별자리, 둘 다 없으면 해제 ===
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
      if (moved > 6) return; // 드래그 → 선택 안 함

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      celestialGroup.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);

      const sel = useSelectionStore.getState();
      const starHit = starField ? starField.raycast(raycaster) : null;
      if (starHit) {
        sel.selectStar(starHit.star);
        return;
      }
      const conId = constLayer ? constLayer.raycast(raycaster) : null;
      if (conId) sel.selectConstellation(conId);
      else sel.clearSelection();
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
      celestialGroup.remove(starRing);
      ringTex.dispose();
      ringMat.dispose();
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
