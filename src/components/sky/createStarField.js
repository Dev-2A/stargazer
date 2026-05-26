import * as THREE from "three";
import { equatorialToVec3, bvToColor, magnitudeToSize } from "../../lib/celestial";

// 정점 셰이더: 별마다 다른 크기를 gl_PointSize로 적용
const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 starColor;
  varying vec3 vColor;
  uniform float uPixelRatio;

  void main() {
    vColor = starColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio; // CSS px → 프레임버퍼 px 보정
    gl_Position = projectionMatrix * mvPosition;
    }
`;

// 프래그먼트 셰이더: 사각형 점을 둥글고 부드러운 별로
const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float d = length(coord);
    if (d > 0.5) discard;                     // 원 바깥은 버림
    float alpha = smoothstep(0.5, 0.05, d); // 가장자리 부드럽게
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/**
 * 별 카탈로그로 단일 THREE.Points 객체를 생성.
 * @param {import('../../lib/stars').Star[]} stars
 * @param {{ radius?: number, magLimit?: number }} [options]
 */
export function createStarField(stars, { radius = 100, magLimit = 6.5 } = {}) {
  const n = stars.length;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    const star = stars[i];
    const { x, y, z } = equatorialToVec3(star.ra, star.dec, radius);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const [r, g, b] = bvToColor(star.ci);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;

    sizes[i] = magnitudeToSize(star.mag, magLimit);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("starColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending, // 겹친 별이 더 밝게 - 은은한 발광
    depthWrite: false,
    depthTest: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; // 천구 전체를 항상 렌더

  return {
    points,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
