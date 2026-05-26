/**
 * @typedef {Object} Star
 * @property {number} id - HYG 데이터베이스 ID
 * @property {number|null} hip - Hipparcos 카탈로그 ID
 * @property {string|null} name - 고유명 (예: "Sirius")
 * @property {number} ra - 적경 (시간, 0~24)
 * @property {number} dec - 적위 (도, -90~90)
 * @property {number} mag - 겉보기 등급
 * @property {number|null} ci - B-V 색지수
 * @property {string|null} spect - 분광형 (예: "G2V")
 * @property {string|null} con - 별자리 약어 (예: "Ori")
 */

/**
 * @typedef {Object} CatalogMeta
 * @property {string} source
 * @property {string} sourceUrl
 * @property {string} license
 * @property {string} generated
 * @property {number} magLimit
 * @property {number} count
 */

/**
 * @typedef {Object} StarCatalog
 * @property {CatalogMeta} meta
 * @property {Star[]} stars
 */

let cache = null;

/**
 * HYG 별 카탈로그를 로드.
 * 최초 호출 시 fetch + 파싱, 이후엔 메모리 캐시 사용.
 * @returns {Promise<StarCatalog>}
 */
export async function loadStars() {
  if (cache) return cache;

  const url = `${import.meta.env.BASE_URL}data/stars.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `별 데이터 로드 실패: HTTP ${res.status} (${url})\n` +
        `→ npm run build:stars 가 실행되어 public/data/stars.json 이 존재하는지 확인`,
    );
  }

  const data = await res.json();
  const { meta, fields, rows } = data;

  // 컬럼 압축된 행을 객체 배열로 변환
  const stars = rows.map((row) => {
    const obj = {};
    fields.forEach((field, i) => {
      obj[field] = row[i];
    });
    return obj;
  });

  cache = { meta, stars };
  return cache;
}
