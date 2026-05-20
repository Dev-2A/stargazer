import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function SkyCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // === 1. Scene ===
    const scene = new THREE.Scene();

    // === 2. Camera — 관측자 시점 ===
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    // 카메라를 천구 중심 근처에 두고, target도 원점에 두면
    // OrbitControls 회전 시 카메라가 거의 제자리에서 시선만 회전함
    camera.position.set(0, 0, 0.001);

    // === 3. Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // === 4. OrbitControls — 시선 회전 ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); // 천구 중심을 바라봄
    controls.enableDamping = true; // 부드러운 관성
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.4; // 천천히 — 별 관측 느낌
    controls.enableZoom = false; // 휠은 따로 FOV 줌으로 처리
    controls.enablePan = false; // 관측자는 한 자리에 고정
    controls.minPolarAngle = 0.01; // 천정 근방 gimbal 회피
    controls.maxPolarAngle = Math.PI - 0.01; // 천저 근방 gimbal 회피

    // === 5. 휠 → FOV 줌 (30°~90°) ===
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 2;
      camera.fov = THREE.MathUtils.clamp(camera.fov + delta, 30, 90);
      camera.updateProjectionMatrix();
    };
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    // === 6. 가상 천구 (와이어프레임) — Step 7부터 별이 박힐 자리 ===
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

    // === 7. Resize 대응 ===
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

    // === 8. 애니메이션 루프 ===
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update(); // damping 적용에 필수
      renderer.render(scene, camera);
    };
    animate();

    // === 9. Cleanup ===
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
