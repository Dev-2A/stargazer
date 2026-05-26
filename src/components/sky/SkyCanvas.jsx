import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadStars } from "../../lib/stars";

function SkyCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Step 6 스모크 테스트 — Step 7에서 실제 렌더링으로 대체
    loadStars()
      .then(({ meta, stars }) => {
        const brightest = stars[0];
        const name = brightest.name || `HIP ${brightest.hip}`;
        console.log(
          `[Stargazer] ${stars.length}개 별 로드 (mag ≤ ${meta.magLimit}, ` +
            `가장 밝은 별: ${name}, mag ${brightest.mag})`,
        );
      })
      .catch((err) => console.error("[Stargazer] 별 데이터 로드 실패:", err));

    // === Scene ===
    const scene = new THREE.Scene();

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 0.001);

    // === Renderer ===
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

    // === 가상 천구 (와이어프레임) ===
    const sphereGeo = new THREE.SphereGeometry(100, 48, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x7cc4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

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
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("wheel", handleWheel);
      controls.dispose();
      renderer.domElement.remove();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SkyCanvas;
