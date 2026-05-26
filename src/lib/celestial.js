/**
 * 적도좌표(RA/Dec)를 천구 위 3D 위치로 변환.
 * Step 7에서는 고정 적도 프레임에 배치. Step 8에서 관측자 기반 변환이 추가됨.
 * @param {number} raHours - 적경 (시간, 0~24)
 * @param {number} decDeg - 적위 (도, -90~90)
 * @param {number} radius - 천구 반지름
 * @returns {{x:number, y:number, z:number}}
 */
export function equatorialToVec3(raHours, decDeg, radius = 100) {
  const ra = raHours * (Math.PI / 12); // 시간 → 라디안 (24h = 2π)
  const dec = decDeg * (Math.PI / 180); // 도 → 라디안
  return {
    x: radius * Math.cos(dec) * Math.cos(ra),
    y: radius * Math.sin(dec), // +Y = 북천극 방향
    z: -radius * Math.cos(dec) * Math.sin(ra),
  };
}

// B-V 색지수 → RGB 색상 보간 스톱 (뜨거운 파랑 → 차가운 빨강)
const COLOR_STOPS = [
  { bv: -0.4, rgb: [0.61, 0.69, 1.0] }, // 청색 (O/B형)
  { bv: 0.0, rgb: [0.79, 0.84, 1.0] }, // 청백색 (A형)
  { bv: 0.4, rgb: [0.97, 0.97, 1.0] }, // 백색 (F형)
  { bv: 0.8, rgb: [1.0, 0.96, 0.92] }, // 황백색 (G형, 태양)
  { bv: 1.2, rgb: [1.0, 0.82, 0.63] }, // 주황 (K형)
  { bv: 1.6, rgb: [1.0, 0.73, 0.48] }, // 진주황
  { bv: 2.0, rgb: [1.0, 0.62, 0.41] }, // 적주황 (M형)
];

/**
 * B-V 색지수를 RGB(0~1)로 변환. null이면 백색 기본값.
 * @param {number|null} bv
 * @returns {[number, number, number]}
 */
export function bvToColor(bv) {
  if (bv === null || !Number.isFinite(bv)) bv = 0.5;
  if (bv <= COLOR_STOPS[0].bv) return COLOR_STOPS[0].rgb;
  const last = COLOR_STOPS[COLOR_STOPS.length - 1];
  if (bv >= last.bv) return last.rgb;
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const a = COLOR_STOPS[i];
    const b = COLOR_STOPS[i + 1];
    if (bv >= a.bv && bv <= b.bv) {
      const t = (bv - a.bv) / (b.bv - a.bv);
      return [
        a.rgb[0] + (b.rgb[0] - a.rgb[0]) * t,
        a.rgb[1] + (b.rgb[1] - a.rgb[1]) * t,
        a.rgb[2] + (b.rgb[2] - a.rgb[2]) * t,
      ];
    }
  }
  return [1, 1, 1];
}

/**
 * 겉보기 등급 → 점 크기(CSS px). 밝을수록(등급↓) 큼.
 * @param {number} mag
 * @param {number} magLimit
 * @returns {number}
 */
export function magnitudeToSize(mag, magLimit = 6.5) {
  const s = 1.2 + (magLimit - mag) * 0.85;
  return Math.max(1.0, Math.min(9.0, s));
}
