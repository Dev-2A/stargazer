// 세계 주요 도시 큐레이션 (87개) — 한글/영문 검색, 위경도
// 외부 지오코딩 API 없이 정적 데이터로 오프라인 작동
export const CITIES = [
  // === 대한민국 ===
  { ko: "서울", en: "Seoul", country: "대한민국", lat: 37.5665, lon: 126.978 },
  { ko: "부산", en: "Busan", country: "대한민국", lat: 35.1796, lon: 129.0756 },
  {
    ko: "인천",
    en: "Incheon",
    country: "대한민국",
    lat: 37.4563,
    lon: 126.7052,
  },
  { ko: "대구", en: "Daegu", country: "대한민국", lat: 35.8714, lon: 128.6014 },
  {
    ko: "대전",
    en: "Daejeon",
    country: "대한민국",
    lat: 36.3504,
    lon: 127.3845,
  },
  {
    ko: "광주",
    en: "Gwangju",
    country: "대한민국",
    lat: 35.1595,
    lon: 126.8526,
  },
  { ko: "울산", en: "Ulsan", country: "대한민국", lat: 35.5384, lon: 129.3114 },
  { ko: "세종", en: "Sejong", country: "대한민국", lat: 36.4801, lon: 127.289 },
  { ko: "수원", en: "Suwon", country: "대한민국", lat: 37.2636, lon: 127.0286 },
  { ko: "제주", en: "Jeju", country: "대한민국", lat: 33.4996, lon: 126.5312 },
  {
    ko: "춘천",
    en: "Chuncheon",
    country: "대한민국",
    lat: 37.8813,
    lon: 127.73,
  },
  {
    ko: "강릉",
    en: "Gangneung",
    country: "대한민국",
    lat: 37.7519,
    lon: 128.8761,
  },
  { ko: "전주", en: "Jeonju", country: "대한민국", lat: 35.8242, lon: 127.148 },
  {
    ko: "청주",
    en: "Cheongju",
    country: "대한민국",
    lat: 36.6424,
    lon: 127.489,
  },
  { ko: "포항", en: "Pohang", country: "대한민국", lat: 36.019, lon: 129.3435 },
  { ko: "여수", en: "Yeosu", country: "대한민국", lat: 34.7604, lon: 127.6622 },
  {
    ko: "경주",
    en: "Gyeongju",
    country: "대한민국",
    lat: 35.8562,
    lon: 129.2247,
  },
  {
    ko: "안동",
    en: "Andong",
    country: "대한민국",
    lat: 36.5684,
    lon: 128.7294,
  },
  { ko: "속초", en: "Sokcho", country: "대한민국", lat: 38.207, lon: 128.5918 },
  // === 동아시아 ===
  { ko: "도쿄", en: "Tokyo", country: "일본", lat: 35.6762, lon: 139.6503 },
  { ko: "오사카", en: "Osaka", country: "일본", lat: 34.6937, lon: 135.5023 },
  { ko: "삿포로", en: "Sapporo", country: "일본", lat: 43.0618, lon: 141.3545 },
  {
    ko: "후쿠오카",
    en: "Fukuoka",
    country: "일본",
    lat: 33.5904,
    lon: 130.4017,
  },
  { ko: "베이징", en: "Beijing", country: "중국", lat: 39.9042, lon: 116.4074 },
  {
    ko: "상하이",
    en: "Shanghai",
    country: "중국",
    lat: 31.2304,
    lon: 121.4737,
  },
  { ko: "홍콩", en: "Hong Kong", country: "중국", lat: 22.3193, lon: 114.1694 },
  { ko: "타이베이", en: "Taipei", country: "대만", lat: 25.033, lon: 121.5654 },
  {
    ko: "울란바토르",
    en: "Ulaanbaatar",
    country: "몽골",
    lat: 47.8864,
    lon: 106.9057,
  },
  // === 동남·남아시아 ===
  {
    ko: "싱가포르",
    en: "Singapore",
    country: "싱가포르",
    lat: 1.3521,
    lon: 103.8198,
  },
  { ko: "방콕", en: "Bangkok", country: "태국", lat: 13.7563, lon: 100.5018 },
  {
    ko: "자카르타",
    en: "Jakarta",
    country: "인도네시아",
    lat: -6.2088,
    lon: 106.8456,
  },
  {
    ko: "쿠알라룸푸르",
    en: "Kuala Lumpur",
    country: "말레이시아",
    lat: 3.139,
    lon: 101.6869,
  },
  {
    ko: "마닐라",
    en: "Manila",
    country: "필리핀",
    lat: 14.5995,
    lon: 120.9842,
  },
  { ko: "하노이", en: "Hanoi", country: "베트남", lat: 21.0278, lon: 105.8342 },
  { ko: "뉴델리", en: "New Delhi", country: "인도", lat: 28.6139, lon: 77.209 },
  { ko: "뭄바이", en: "Mumbai", country: "인도", lat: 19.076, lon: 72.8777 },
  // === 중동·중앙아시아 ===
  { ko: "두바이", en: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  {
    ko: "이스탄불",
    en: "Istanbul",
    country: "튀르키예",
    lat: 41.0082,
    lon: 28.9784,
  },
  { ko: "테헤란", en: "Tehran", country: "이란", lat: 35.6892, lon: 51.389 },
  {
    ko: "예루살렘",
    en: "Jerusalem",
    country: "이스라엘",
    lat: 31.7683,
    lon: 35.2137,
  },
  {
    ko: "타슈켄트",
    en: "Tashkent",
    country: "우즈베키스탄",
    lat: 41.2995,
    lon: 69.2401,
  },
  // === 유럽 ===
  { ko: "런던", en: "London", country: "영국", lat: 51.5074, lon: -0.1278 },
  { ko: "파리", en: "Paris", country: "프랑스", lat: 48.8566, lon: 2.3522 },
  { ko: "베를린", en: "Berlin", country: "독일", lat: 52.52, lon: 13.405 },
  { ko: "로마", en: "Rome", country: "이탈리아", lat: 41.9028, lon: 12.4964 },
  {
    ko: "마드리드",
    en: "Madrid",
    country: "스페인",
    lat: 40.4168,
    lon: -3.7038,
  },
  {
    ko: "바르셀로나",
    en: "Barcelona",
    country: "스페인",
    lat: 41.3851,
    lon: 2.1734,
  },
  {
    ko: "암스테르담",
    en: "Amsterdam",
    country: "네덜란드",
    lat: 52.3676,
    lon: 4.9041,
  },
  { ko: "빈", en: "Vienna", country: "오스트리아", lat: 48.2082, lon: 16.3738 },
  { ko: "프라하", en: "Prague", country: "체코", lat: 50.0755, lon: 14.4378 },
  { ko: "취리히", en: "Zurich", country: "스위스", lat: 47.3769, lon: 8.5417 },
  {
    ko: "스톡홀름",
    en: "Stockholm",
    country: "스웨덴",
    lat: 59.3293,
    lon: 18.0686,
  },
  { ko: "오슬로", en: "Oslo", country: "노르웨이", lat: 59.9139, lon: 10.7522 },
  {
    ko: "헬싱키",
    en: "Helsinki",
    country: "핀란드",
    lat: 60.1699,
    lon: 24.9384,
  },
  {
    ko: "레이캬비크",
    en: "Reykjavik",
    country: "아이슬란드",
    lat: 64.1466,
    lon: -21.9426,
  },
  {
    ko: "트롬쇠",
    en: "Tromso",
    country: "노르웨이",
    lat: 69.6492,
    lon: 18.9553,
  },
  {
    ko: "모스크바",
    en: "Moscow",
    country: "러시아",
    lat: 55.7558,
    lon: 37.6173,
  },
  { ko: "아테네", en: "Athens", country: "그리스", lat: 37.9838, lon: 23.7275 },
  {
    ko: "리스본",
    en: "Lisbon",
    country: "포르투갈",
    lat: 38.7223,
    lon: -9.1393,
  },
  // === 아프리카 ===
  { ko: "카이로", en: "Cairo", country: "이집트", lat: 30.0444, lon: 31.2357 },
  {
    ko: "케이프타운",
    en: "Cape Town",
    country: "남아프리카공화국",
    lat: -33.9249,
    lon: 18.4241,
  },
  {
    ko: "나이로비",
    en: "Nairobi",
    country: "케냐",
    lat: -1.2864,
    lon: 36.8172,
  },
  {
    ko: "라고스",
    en: "Lagos",
    country: "나이지리아",
    lat: 6.5244,
    lon: 3.3792,
  },
  {
    ko: "카사블랑카",
    en: "Casablanca",
    country: "모로코",
    lat: 33.5731,
    lon: -7.5898,
  },
  // === 북미 ===
  { ko: "뉴욕", en: "New York", country: "미국", lat: 40.7128, lon: -74.006 },
  {
    ko: "로스앤젤레스",
    en: "Los Angeles",
    country: "미국",
    lat: 34.0522,
    lon: -118.2437,
  },
  { ko: "시카고", en: "Chicago", country: "미국", lat: 41.8781, lon: -87.6298 },
  {
    ko: "샌프란시스코",
    en: "San Francisco",
    country: "미국",
    lat: 37.7749,
    lon: -122.4194,
  },
  {
    ko: "시애틀",
    en: "Seattle",
    country: "미국",
    lat: 47.6062,
    lon: -122.3321,
  },
  {
    ko: "호놀룰루",
    en: "Honolulu",
    country: "미국",
    lat: 21.3069,
    lon: -157.8583,
  },
  {
    ko: "앵커리지",
    en: "Anchorage",
    country: "미국",
    lat: 61.2181,
    lon: -149.9003,
  },
  {
    ko: "토론토",
    en: "Toronto",
    country: "캐나다",
    lat: 43.6532,
    lon: -79.3832,
  },
  {
    ko: "밴쿠버",
    en: "Vancouver",
    country: "캐나다",
    lat: 49.2827,
    lon: -123.1207,
  },
  {
    ko: "멕시코시티",
    en: "Mexico City",
    country: "멕시코",
    lat: 19.4326,
    lon: -99.1332,
  },
  // === 중남미 ===
  {
    ko: "보고타",
    en: "Bogota",
    country: "콜롬비아",
    lat: 4.711,
    lon: -74.0721,
  },
  { ko: "리마", en: "Lima", country: "페루", lat: -12.0464, lon: -77.0428 },
  { ko: "키토", en: "Quito", country: "에콰도르", lat: -0.1807, lon: -78.4678 },
  {
    ko: "상파울루",
    en: "Sao Paulo",
    country: "브라질",
    lat: -23.5505,
    lon: -46.6333,
  },
  {
    ko: "리우데자네이루",
    en: "Rio de Janeiro",
    country: "브라질",
    lat: -22.9068,
    lon: -43.1729,
  },
  {
    ko: "부에노스아이레스",
    en: "Buenos Aires",
    country: "아르헨티나",
    lat: -34.6037,
    lon: -58.3816,
  },
  {
    ko: "산티아고",
    en: "Santiago",
    country: "칠레",
    lat: -33.4489,
    lon: -70.6693,
  },
  {
    ko: "우수아이아",
    en: "Ushuaia",
    country: "아르헨티나",
    lat: -54.8019,
    lon: -68.303,
  },
  // === 오세아니아 ===
  { ko: "시드니", en: "Sydney", country: "호주", lat: -33.8688, lon: 151.2093 },
  {
    ko: "멜버른",
    en: "Melbourne",
    country: "호주",
    lat: -37.8136,
    lon: 144.9631,
  },
  { ko: "퍼스", en: "Perth", country: "호주", lat: -31.9505, lon: 115.8605 },
  {
    ko: "오클랜드",
    en: "Auckland",
    country: "뉴질랜드",
    lat: -36.8485,
    lon: 174.7633,
  },
  {
    ko: "웰링턴",
    en: "Wellington",
    country: "뉴질랜드",
    lat: -41.2865,
    lon: 174.7762,
  },
];

/**
 * 한글/영문/국가명으로 도시 검색. prefix > substring > 국가명 순 우선.
 * @param {string} query
 * @param {number} limit
 * @returns {typeof CITIES}
 */
export function searchCities(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const c of CITIES) {
    const ko = c.ko.toLowerCase();
    const en = c.en.toLowerCase();
    const country = c.country.toLowerCase();
    let score = -1;
    if (ko.startsWith(q) || en.startsWith(q)) score = 0;
    else if (ko.includes(q) || en.includes(q)) score = 1;
    else if (country.includes(q)) score = 2;
    if (score >= 0) scored.push({ c, score });
  }
  scored.sort((a, b) => a.score - b.score); // 동점은 배열 순서(중요도) 유지
  return scored.slice(0, limit).map((s) => s.c);
}
