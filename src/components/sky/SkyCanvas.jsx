import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadStars } from "../../lib/stars";
import { loadConstellations } from "../../lib/constellations";
import { createStarField } from "./createStarField";
import { createConstellationLines } from "./createConstellationLines";
import { createHorizon } from "./createHorizon";
import {
  equatorialToHorizontalQuaternion,
  equatorialToVec3,
  altAzFromVec3,
} from "../../lib/celestial";
import { useObserverStore } from "../../store/observerStore";

function SkyCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let starField = null;
    let constLines = null;

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

    // === 지평선 (월드 고정, 그룹 밖) ===
    const horizon = createHorizon();
    scene.add(horizon.group);

    // === 천구 그룹 (별 + 별자리 선이 함께 회전) ===
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

      // 디버그: Polaris 고도/방위
      const pe = equatorialToVec3(2.5303, 89.264, 100);
      const pv = new THREE.Vector3(pe.x, pe.y, pe.z).applyQuaternion(rotation);
      const { alt, az } = altAzFromVec3(pv);
      console.log(
        `[Stargazer] ${observer.name} · Polaris 고도 ${alt.toFixed(1)}° 방위 ${az.toFixed(1)}°`,
      );
    };
    applyRotation(); // 그룹은 처음부터 존재 → 즉시 적용 가능
    const unsubscribe = useObserverStore.subscribe(applyRotation);

    // === 별 로드 ===
    loadStars()
      .then(({ meta, stars }) => {
        if (disposed) return;
        starField = createStarField(stars, { magLimit: meta.magLimit });
        celestialGroup.add(starField.points);
        console.log(`[Stargazer] ${stars.length}개 별 렌더링`);
      })
      .catch((err) => console.error("[Stargazer] 별 로드 실패:", err));

    // === 별자리 선 로드 ===
    loadConstellations()
      .then(({ meta, constellations }) => {
        if (disposed) return;
        constLines = createConstellationLines(constellations);
        celestialGroup.add(constLines.lines);
        console.log(`[Stargazer] ${meta.count}개 별자리 선 렌더링`);
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
      unsubscribe();
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("wheel", handleWheel);
      controls.dispose();
      scene.remove(horizon.group);
      horizon.dispose();
      if (starField) {
        celestialGroup.remove(starField.points);
        starField.dispose();
      }
      if (constLines) {
        celestialGroup.remove(constLines.lines);
        constLines.dispose();
      }
      scene.remove(celestialGroup);
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SkyCanvas;
