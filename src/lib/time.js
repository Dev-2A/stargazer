/** 해당 시각의 로컬 자정(00:00:00) epoch ms */
export function dayStartLocal(timeMs) {
  const d = new Date(timeMs);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** timeMs → 그날 자정부터 경과 시간(0~24, 로컬 기준) */
export function getSliderHours(timeMs) {
  return (timeMs - dayStartLocal(timeMs)) / 3600000;
}

/** 같은 날짜에서 시각(0~24)만 바꾼 timeMs */
export function setSliderHours(timeMs, hours) {
  return dayStartLocal(timeMs) + hours * 3600000;
}

/** 날짜 문자열(YYYY-MM-DD)로 날짜만 변경, 시각은 유지 */
export function setDatePart(timeMs, dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const cur = new Date(timeMs);
  const next = new Date(timeMs);
  next.setFullYear(y, m - 1, d);
  next.setHours(cur.getHours(), cur.getMinutes(), 0, 0);
  return next.getTime();
}

/** <input type="date">용 YYYY-MM-DD (로컬) */
export function toDateInputValue(timeMs) {
  const d = new Date(timeMs);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
