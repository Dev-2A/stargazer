import * as THREE from "three";
import * as Astronomy from "astronomy-engine";

/**
 * 적도좌표(RA/Dec)를 천구 위 3D 위치로 변환 (고정 적도 프레임).
 * +Y=북천극, +X=춘분점. z 부호는 천구 내부 시점에서 동서가 맞도록 +.
 */
export function equatorialToVec3(raHours, decDeg, radius = 100) {
  const ra = raHours * (Math.PI / 12);
  const dec = decDeg * (Math.PI / 180);
  return {
    x: radius * Math.cos(dec) * Math.cos(ra),
    y: radius * Math.sin(dec),
    z: radius * Math.cos(dec) * Math.sin(ra),
  };
}

/**
 * 지방 항성시 (Local Sidereal Time, 시간 단위 0~24).
 * @param {Date} date
 * @param {number} longitudeDeg - 경도(동경 +)
 */
export function localSiderealTime(date, longitudeDeg) {
  const gast = Astronomy.SiderealTime(date); // 그리니치 겉보기 항성시(시간)
  return (((gast + longitudeDeg / 15) % 24) + 24) % 24;
}

/**
 * 적도 프레임 → 관측자 지평 프레임 회전 Quaternion.
 * 천구 전체에 한 번 적용. R = R_x(β)·R_y(γ),  β=90°−위도, γ=90°+LST.
 * 결과 프레임: +Y=천정, +Z=북, +X=동, -Z=남.
 */
export function equatorialToHorizontalQuaternion(
  date,
  latitudeDeg,
  longitudeDeg,
) {
  const lstRad = localSiderealTime(date, longitudeDeg) * (Math.PI / 12);
  const phi = latitudeDeg * (Math.PI / 180);
  const beta = Math.PI / 2 - phi;
  const gamma = Math.PI / 2 + lstRad;

  const qY = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    gamma,
  );
  const qX = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    beta,
  );
  // R_y 먼저, R_x 나중 → q = qX * qY
  return new THREE.Quaternion().multiplyQuaternions(qX, qY);
}

/**
 * 지평 프레임 3D 벡터에서 고도/방위 추출 (검증·디버그용).
 * @returns {{alt:number, az:number}} 도 단위. az: 북(+Z)에서 동(+X)으로.
 */
export function altAzFromVec3(vec) {
  const r = vec.length();
  const alt =
    (Math.asin(THREE.MathUtils.clamp(vec.y / r, -1, 1)) * 180) / Math.PI;
  const az = ((Math.atan2(vec.x, vec.z) * 180) / Math.PI + 360) % 360;
  return { alt, az };
}

// === B-V 색지수 → RGB (변경 없음) ===
const COLOR_STOPS = [
  { bv: -0.4, rgb: [0.61, 0.69, 1.0] },
  { bv: 0.0, rgb: [0.79, 0.84, 1.0] },
  { bv: 0.4, rgb: [0.97, 0.97, 1.0] },
  { bv: 0.8, rgb: [1.0, 0.96, 0.92] },
  { bv: 1.2, rgb: [1.0, 0.82, 0.63] },
  { bv: 1.6, rgb: [1.0, 0.73, 0.48] },
  { bv: 2.0, rgb: [1.0, 0.62, 0.41] },
];

export function bvToColor(bv) {
  if (bv == null || !Number.isFinite(bv)) bv = 0.5;
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

export function magnitudeToSize(mag, magLimit = 6.5) {
  const s = 1.2 + (magLimit - mag) * 0.85;
  return Math.max(1.0, Math.min(9.0, s));
}

// 분광형 첫 글자 → 한국어 설명 (Harvard 분류 O B A F G K M)
const SPECTRAL_DESC = {
  O: "청색 초고온성",
  B: "청백색 고온성",
  A: "백색성",
  F: "황백색성",
  G: "황색성 (태양형)",
  K: "주황색성",
  M: "적색 저온성",
};

/**
 * 분광형 문자열에서 한국어 설명 추출 (예: "G2V" → "황색성 (태양형)").
 * @param {string|null} spect
 * @returns {string|null}
 */
export function spectralDescription(spect) {
  if (!spect) return null;
  const cls = spect.trim()[0]?.toUpperCase();
  return SPECTRAL_DESC[cls] || null;
}
