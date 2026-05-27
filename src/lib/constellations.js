import { getConstellationName } from "../data/constellationNames";
import { getConstellationInfo } from "../data/constellationInfo";

let cache = null;

/**
 * 별자리 선 데이터 로드 (메모리 캐시).
 * @returns {Promise<{meta: object, constellations: {id: string, lines: number[][][]}[]}>}
 */
export async function loadConstellations() {
  if (cache) return cache;
  const url = `${import.meta.env.BASE_URL}data/constellations.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `별자리 데이터 로드 실패: HTTP ${res.status} (${url})\n` +
        `→ npm run build:constellations 실행 확인`,
    );
  }
  cache = await res.json();
  return cache;
}

/**
 * 약어로 이름 + 상세정보를 한 번에 조회.
 * @param {string} id - 3글자 약어 (예: 'Ori')
 * @returns {{ id: string, ko: string, la: string, info: object|null, hasInfo: boolean }}
 */
export function getConstellationDetail(id) {
  const { ko, la } = getConstellationName(id);
  const info = getConstellationInfo(id);
  return { id, ko, la, info, hasInfo: info !== null };
}
