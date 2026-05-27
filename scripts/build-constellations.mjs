// 별자리 선 빌드 — d3-celestial GeoJSON → RA(시)/Dec(도)
// 사용법: npm run build:constellations
// 데이터: d3-celestial (BSD-3-Clause) https://github.com/ofrohn/d3-celestial

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SRC_URL =
  "https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json";
const CACHE_DIR = join(ROOT, "scripts", ".cache");
const CACHE_PATH = join(CACHE_DIR, "constellations.lines.json");
const OUTPUT_DIR = join(ROOT, "public", "data");
const OUTPUT_PATH = join(OUTPUT_DIR, "constellations.json");

async function downloadIfMissing() {
  if (existsSync(CACHE_PATH)) {
    console.log("✓ 별자리 선 캐시 사용");
    return;
  }
  console.log("⬇ d3-celestial 별자리 선 다운로드 중...");
  mkdirSync(CACHE_DIR, { recursive: true });
  const res = await fetch(SRC_URL);
  if (!res.ok)
    throw new Error(`다운로드 실패: HTTP ${res.status}\n수동: ${SRC_URL}`);
  writeFileSync(CACHE_PATH, await res.text());
  console.log("✓ 다운로드 완료");
}

function build() {
  const src = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  const constellations = [];
  let segmentCount = 0;

  for (const f of src.features) {
    const lines = f.geometry.coordinates.map((line) =>
      line.map(([lon, lat]) => {
        const raHours = (((lon % 360) + 360) % 360) / 15; // 도 → 시, 0~24 정규화
        return [
          Math.round(raHours * 10000) / 10000,
          Math.round(lat * 10000) / 10000,
        ];
      }),
    );
    for (const line of lines) segmentCount += Math.max(0, line.length - 1);
    constellations.push({ id: f.id, lines });
  }

  const output = {
    meta: {
      source: "d3-celestial (constellation lines)",
      sourceUrl: "https://github.com/ofrohn/d3-celestial",
      license: "BSD-3-Clause",
      generated: new Date().toISOString(),
      count: constellations.length,
      segmentCount,
    },
    constellations,
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const json = JSON.stringify(output);
  writeFileSync(OUTPUT_PATH, json);
  console.log(
    `✓ ${constellations.length}개 별자리, ${segmentCount}개 세그먼트 → ` +
      `public/data/constellations.json (${(json.length / 1024).toFixed(0)}KB)`,
  );
}

await downloadIfMissing();
build();
