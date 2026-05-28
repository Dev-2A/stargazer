import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 천구 캔버스를 배경 그라데이션 + 캡션과 합성해 PNG Blob 생성.
 * @param {HTMLCanvasElement} glCanvas - WebGL 렌더러의 canvas
 * @param {{ observerName: string, timeMs: number }} meta
 * @returns {Promise<Blob>}
 */
export async function composeSkyImage(glCanvas, { observerName, timeMs }) {
  const w = glCanvas.width;
  const h = glCanvas.height;

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");

  // 1. 배경 그라데이션 (night-900 → night-950, CSS와 동일)
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#1a2347");
  grad.addColorStop(1, "#0a1128");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. 천구(투명 캔버스) 합성
  ctx.drawImage(glCanvas, 0, 0);

  // 3. 하단 캡션 바
  const scale = w / 1280; // 1280px 기준 비례
  const pad = 24 * scale;
  const fontMain = `bold ${22 * scale}px sans-serif`;
  const fontSub = `${15 * scale}px sans-serif`;
  const dateStr = format(new Date(timeMs), "yyyy년 M월 d일 (EEE) HH:mm", {
    locale: ko,
  });

  // 하단 그라데이션 오버레이 (가독성)
  const capH = 70 * scale;
  const capGrad = ctx.createLinearGradient(0, h - capH * 1.6, 0, h);
  capGrad.addColorStop(0, "rgba(10,17,40,0)");
  capGrad.addColorStop(1, "rgba(10,17,40,0.85)");
  ctx.fillStyle = capGrad;
  ctx.fillRect(0, h - capH * 1.6, w, capH * 1.6);

  // 위치
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#e0efff";
  ctx.font = fontMain;
  ctx.fillText(observerName, pad, h - pad - 22 * scale);

  // 날짜·시각
  ctx.fillStyle = "#7cc4ff";
  ctx.font = fontSub;
  ctx.fillText(dateStr, pad, h - pad);

  // 워터마크 (우하단)
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(124,196,255,0.6)";
  ctx.font = `${14 * scale}px sans-serif`;
  ctx.fillText("🌌 Stargazer", w - pad, h - pad);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    out.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG 생성 실패"));
    }, "image/png");
  });
}

/** Blob을 파일로 다운로드 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
