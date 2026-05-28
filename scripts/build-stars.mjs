// HYG v4.2 별 카탈로그 빌드
// 다운로드 (gzip, Git LFS) → 압축 해제 → mag ≤ 6.5 필터 → 컬럼 압축 JSON
//
// 사용법: npm run build:stars
// 캐시 무효화: scripts/.cache 폴더 삭제 후 재실행
//
// 데이터: HYG v4.2 (CC BY-SA 4.0) https://codeberg.org/astronexus/hyg

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ⚠️ Git LFS 파일이라 /raw/ 가 아닌 /media/ 경로로 받아야 실제 gzip이 옴
const HYG_URL =
  "https://codeberg.org/astronexus/hyg/media/branch/main/data/hyg/CURRENT/hyg_v42.csv.gz";
const CACHE_DIR = join(ROOT, "scripts", ".cache");
const CACHE_PATH = join(CACHE_DIR, "hyg_v42.csv");
const OUTPUT_DIR = join(ROOT, "public", "data");
const OUTPUT_PATH = join(OUTPUT_DIR, "stars.json");

const MAG_LIMIT = 6.5; // 육안 한계 등급

async function downloadIfMissing() {
  if (existsSync(CACHE_PATH)) {
    const size = (readFileSync(CACHE_PATH).length / 1024 / 1024).toFixed(1);
    console.log(`✓ HYG CSV 캐시 사용 (${size}MB)`);
    return;
  }
  console.log("⬇ HYG v4.2 다운로드 중... (gzip ~13MB)");
  mkdirSync(CACHE_DIR, { recursive: true });

  const res = await fetch(HYG_URL);
  if (!res.ok) {
    throw new Error(
      `다운로드 실패: HTTP ${res.status}\n` +
        `수동 다운로드: ${HYG_URL}\n` +
        `→ 압축 풀어서 ${CACHE_PATH}에 저장 후 재실행`,
    );
  }

  const gzipped = Buffer.from(await res.arrayBuffer());

  // LFS 포인터(작은 텍스트)가 잘못 받아진 경우 친절한 에러
  if (gzipped.length < 1000) {
    throw new Error(
      `받은 파일이 너무 작음 (${gzipped.length}B). LFS 포인터일 가능성.\n` +
        `URL이 /media/ 경로인지 확인: ${HYG_URL}`,
    );
  }

  console.log("  압축 해제 중...");
  const csv = gunzipSync(gzipped).toString("utf-8");
  writeFileSync(CACHE_PATH, csv);

  const sizeMB = (csv.length / 1024 / 1024).toFixed(1);
  console.log(`✓ 다운로드·압축 해제 완료 (${sizeMB}MB)`);
}

// 따옴표를 처리하는 CSV 한 줄 파서 (v4.2는 헤더·문자열 필드에 따옴표 사용)
function parseLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        fields.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function build() {
  const csv = readFileSync(CACHE_PATH, "utf-8");
  const lines = csv.split("\n").filter((l) => l.trim().length > 0);
  const header = parseLine(lines[0]);

  const idx = (name) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`컬럼 누락: ${name}`);
    return i;
  };
  const I = {
    id: idx("id"),
    hip: idx("hip"),
    proper: idx("proper"),
    ra: idx("ra"),
    dec: idx("dec"),
    mag: idx("mag"),
    ci: idx("ci"),
    spect: idx("spect"),
    con: idx("con"),
    dist: idx("dist"),
  };

  const stars = [];
  for (let n = 1; n < lines.length; n++) {
    const row = parseLine(lines[n]);
    const mag = parseFloat(row[I.mag]);
    if (!Number.isFinite(mag) || mag > MAG_LIMIT) continue;

    const id = parseInt(row[I.id]);
    if (id === 0) continue; // Sun(id=0) 제외

    const dist = parseFloat(row[I.dist]);
    const distPc =
      Number.isFinite(dist) && dist > 0 && dist < 100000
        ? Math.round(dist * 100) / 100
        : null;

    stars.push([
      id,
      row[I.hip] ? parseInt(row[I.hip]) : null,
      row[I.proper] || null,
      Math.round(parseFloat(row[I.ra]) * 10000) / 10000,
      Math.round(parseFloat(row[I.dec]) * 10000) / 10000,
      Math.round(mag * 100) / 100,
      row[I.ci] ? Math.round(parseFloat(row[I.ci]) * 1000) / 1000 : null,
      row[I.spect] || null,
      row[I.con] || null,
      distPc,
    ]);
  }

  // 밝은 별이 앞에
  stars.sort((a, b) => a[5] - b[5]);

  const output = {
    meta: {
      source: "HYG Star Catalog v4.2",
      sourceUrl: "https://codeberg.org/astronexus/hyg",
      license: "CC BY-SA 4.0",
      generated: new Date().toISOString(),
      magLimit: MAG_LIMIT,
      count: stars.length,
    },
    fields: ["id", "hip", "name", "ra", "dec", "mag", "ci", "spect", "con", "dist"],
    rows: stars,
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const json = JSON.stringify(output);
  writeFileSync(OUTPUT_PATH, json);

  const sizeKB = (json.length / 1024).toFixed(0);
  console.log(`✓ ${stars.length}개 별 → public/data/stars.json (${sizeKB}KB)`);

  console.log("\n가장 밝은 별 5개:");
  stars.slice(0, 5).forEach((s) => {
    const name = (s[2] || `HIP ${s[1]}`).padEnd(20);
    const mag = s[5].toFixed(2).padStart(6);
    const spect = s[7] || "";
    console.log(`  ${name} mag=${mag}  ${spect}`);
  });
}

await downloadIfMissing();
build();
