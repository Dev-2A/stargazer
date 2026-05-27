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
