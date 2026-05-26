import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadStars } from "../../lib/stars";
import { createStarField } from "./createStarField";
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

    // === Scene / Camera / Renderer ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 0.001); // 초기 시선: -Z = 남쪽

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

    // === 관측자/시간 → 천구 회전 적용 ===
    const applyRotation = () => {
      if (!starField) return;
      const { observer, timeMs } = useObserverStore.getState();
      const rotation = equatorialToHorizontalQuaternion(
        new Date(timeMs),
        observer.lat,
        observer.lon,
      );
      starField.points.quaternion.copy(rotation);

      // 디버그: Polaris 고도/방위 (위치 바뀌면 함께 변함)
      const pe = equatorialToVec3(2.5303, 89.264, 100);
      const pv = new THREE.Vector3(pe.x, pe.y, pe.z).applyQuaternion(rotation);
      const { alt, az } = altAzFromVec3(pv);
      console.log(
        `[Stargazer] ${observer.name} · Polaris 고도 ${alt.toFixed(1)}° 방위 ${az.toFixed(1)}°`,
      );
    };

    // 스토어 변화 구독 — 컴포넌트 리렌더 없이 회전만 갱신
    const unsubscribe = useObserverStore.subscribe(applyRotation);

    // === 별 로드 ===
    loadStars()
      .then(({ meta, stars }) => {
        if (disposed) return;
        starField = createStarField(stars, { magLimit: meta.magLimit });
        scene.add(starField.points);
        applyRotation(); // 초기 적용
      })
      .catch((err) => console.error("[Stargazer] 별 렌더링 실패:", err));

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
        scene.remove(starField.points);
        starField.dispose();
      }
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SkyCanvas;
