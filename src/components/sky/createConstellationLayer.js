import * as THREE from "three";
import { equatorialToVec3 } from "../../lib/celestial";

// 한 별자리의 선분 정점 배열 [x,y,z, x,y,z, ...] 생성
function segmentsFor(con, radius) {
  const positions = [];
  for (const line of con.lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = equatorialToVec3(line[i][0], line[i][1], radius);
      const b = equatorialToVec3(line[i + 1][0], line[i + 1][1], radius);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  return positions;
}

/**
 * 별자리 선 + 클릭 히트영역 + 하이라이트를 묶은 레이어.
 * @param {{id:string, lines:number[][][]}[]} constellations
 */
export function createConstellationLayer(
  constellations,
  { radius = 99.5 } = {},
) {
  const group = new THREE.Group();
  const disposables = [];

  // === 1. 기본 선 (어둡게, 단일 LineSegments) ===
  const basePositions = [];
  for (const con of constellations) {
    basePositions.push(...segmentsFor(con, radius));
  }
  const baseGeo = new THREE.BufferGeometry();
  baseGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(basePositions, 3),
  );
  const baseMat = new THREE.LineBasicMaterial({
    color: 0x4ba1f7,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    depthTest: false,
  });
  const baseLines = new THREE.LineSegments(baseGeo, baseMat);
  baseLines.frustumCulled = false;
  group.add(baseLines);
  disposables.push(baseGeo, baseMat);

  // === 2. 히트 스프라이트 (투명, 별자리당 1개) ===
  const hitMat = new THREE.SpriteMaterial({
    transparent: true,
    opacity: 0, // 보이지 않지만 raycast는 됨
    depthTest: false,
    depthWrite: false,
  });
  disposables.push(hitMat);

  const hitSprites = [];
  for (const con of constellations) {
    const sum = new THREE.Vector3();
    let count = 0;
    for (const line of con.lines) {
      for (const pt of line) {
        const v = equatorialToVec3(pt[0], pt[1], radius);
        sum.add(new THREE.Vector3(v.x, v.y, v.z));
        count++;
      }
    }
    if (count === 0) continue;
    sum.normalize().multiplyScalar(radius);

    let maxDist = 0;
    for (const line of con.lines) {
      for (const pt of line) {
        const v = equatorialToVec3(pt[0], pt[1], radius);
        const d = sum.distanceTo(new THREE.Vector3(v.x, v.y, v.z));
        if (d > maxDist) maxDist = d;
      }
    }
    const scale = THREE.MathUtils.clamp(maxDist * 0.7, 6, 28);

    const sprite = new THREE.Sprite(hitMat);
    sprite.position.copy(sum);
    sprite.scale.set(scale, scale, 1);
    sprite.userData.constellationId = con.id;
    group.add(sprite);
    hitSprites.push(sprite);
  }

  // === 3. 하이라이트 선 (밝게, 선택 시 재생성) ===
  const highlightMat = new THREE.LineBasicMaterial({
    color: 0x9ecbff,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    depthTest: false,
  });
  disposables.push(highlightMat);

  let highlightLines = null;
  function clearHighlight() {
    if (highlightLines) {
      group.remove(highlightLines);
      highlightLines.geometry.dispose();
      highlightLines = null;
    }
  }
  function setHighlight(id) {
    clearHighlight();
    if (!id) return;
    const con = constellations.find((c) => c.id === id);
    if (!con) return;
    const positions = segmentsFor(con, radius + 0.3); // 살짝 바깥 → 기본선 위에 또렷이
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    highlightLines = new THREE.LineSegments(geo, highlightMat);
    highlightLines.frustumCulled = false;
    group.add(highlightLines);
  }

  // === 4. Raycast → 별자리 약어 ===
  function raycast(raycaster) {
    const hits = raycaster.intersectObjects(hitSprites, false);
    return hits.length > 0 ? hits[0].object.userData.constellationId : null;
  }

  return {
    group,
    raycast,
    setHighlight,
    dispose() {
      clearHighlight();
      disposables.forEach((d) => d.dispose());
    },
  };
}
