import * as THREE from "three";
import {
  equatorialToVec3,
  bvToColor,
  magnitudeToSize,
} from "../../lib/celestial";

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 starColor;
  varying vec3 vColor;
  uniform float uPixelRatio;

  void main() {
    vColor = starColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float d = length(coord);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

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
    uniforms: { uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  /**
   * 별 raycast. threshold 내 별들 중 클릭 광선에 가장 가까운(distanceToRay 최소) 별 반환.
   * @returns {{ star: object, index: number } | null}
   */
  function raycast(raycaster) {
    const prev = raycaster.params.Points.threshold;
    raycaster.params.Points.threshold = 2.0; // 반지름 100 기준 약 1.1° 클릭 반경
    const hits = raycaster.intersectObject(points, false);
    raycaster.params.Points.threshold = prev;
    if (hits.length === 0) return null;
    let best = hits[0];
    for (const h of hits) {
      if (h.distanceToRay < best.distanceToRay) best = h;
    }
    return { star: stars[best.index], index: best.index };
  }

  return {
    points,
    raycast,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
