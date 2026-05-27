import * as THREE from "three";
import { equatorialToVec3 } from "../../lib/celestial";

/**
 * 별자리 선들을 단일 THREE.LineSegments로 생성 (draw call 1개).
 * @param {{id: string, lines: number[][][]}[]} constellations
 */
export function createConstellationLines(
  constellations,
  { radius = 99.5 } = {},
) {
  const positions = [];

  for (const con of constellations) {
    for (const line of con.lines) {
      // 폴리라인 [p0,p1,p2] → 세그먼트 쌍 [p0,p1, p1,p2]
      for (let i = 0; i < line.length - 1; i++) {
        const a = equatorialToVec3(line[i][0], line[i][1], radius);
        const b = equatorialToVec3(line[i + 1][0], line[i + 1][1], radius);
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  const material = new THREE.LineBasicMaterial({
    color: 0x4ba1f7, // astral-400
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    depthTest: false,
  });

  const lines = new THREE.LineSegments(geometry, material);
  lines.frustumCulled = false;

  return {
    lines,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
