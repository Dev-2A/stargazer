import { useEffect, useRef } from "react";
import * as THREE from "three";

function SkyCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // === 1. Scene ===
    const scene = new THREE.Scene();

    // === 2. Camera — 관측자 시점 (천구 중심에서 바라보기) ===
    const camera = new THREE.PerspectiveCamera(
      65, // FOV
      container.clientWidth / container.clientHeight,
      0.1, // near
      1000, // far
    );
    camera.position.set(0, 0, 0.1); // 거의 원점 — 천구 내부

    // === 3. Renderer ===
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // 투명 캔버스 → 부모의 CSS 그라데이션이 비침
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 레티나 대응, 2 이상은 성능 낭비
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // === 4. 가상 천구 — Step 7부터 별이 박힐 자리 ===
    // BackSide: 카메라가 구 내부에 있으므로 안쪽 면만 렌더
    const sphereGeo = new THREE.SphereGeometry(100, 48, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x7cc4ff, // astral-300
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // === 5. Resize 대응 ===
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return; // 숨겨진 상태 방어
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // === 6. 애니메이션 루프 ===
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      // 매우 느린 회전 — "루프가 살아 있다" 시각 피드백용
      // Step 9에서 관측자 시간·위치 기반 회전으로 대체될 자리
      sphere.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    // === 7. Cleanup — 언마운트 시 자원 해제 ===
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.domElement.remove();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SkyCanvas;
