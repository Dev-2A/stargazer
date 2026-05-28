import { useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";
import { useObserverStore } from "../../store/observerStore";
import {
  getSliderHours,
  setSliderHours,
  setDatePart,
  toDateInputValue,
} from "../../lib/time";

function TimeControls() {
  const timeMs = useObserverStore((s) => s.timeMs);
  const live = useObserverStore((s) => s.live);
  const setTime = useObserverStore((s) => s.setTime);
  const resetToNow = useObserverStore((s) => s.resetToNow);
  const setLive = useObserverStore((s) => s.setLive);
  const tickNow = useObserverStore((s) => s.tickNow);

  // 라이브 모드: 1초마다 현재 시각으로 갱신
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => tickNow(), 1000);
    return () => clearInterval(id);
  }, [live, tickNow]);

  const date = new Date(timeMs);
  const hours = getSliderHours(timeMs);

  const hh = String(Math.floor(hours)).padStart(2, "0");
  const mm = String(Math.floor((hours % 1) * 60)).padStart(2, "0");

  return (
    <div className="px-1">
      <div className="flex items-center gap-1.5 px-2 mb-1.5 text-sm text-night-200">
        <Clock size={14} className="text-astral-300" />
        <span className="font-medium">시간</span>
        {live && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-astral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-astral-400 animate-pulse" />
            실시간
          </span>
        )}
      </div>

      {/* 날짜 + 시각 표시 */}
      <div className="px-2 mb-2">
        <div className="text-astral-100 font-medium">
          {format(date, "yyyy년 M월 d일 (EEE)", { locale: ko })}
        </div>
        <div className="text-2xl font-bold text-night-50 tabular-nums">
          {hh}:{mm}
        </div>
      </div>

      {/* 24시간 슬라이더 */}
      <input
        type="range"
        min={0}
        max={24}
        step={0.0167} // 약 1분 단위
        value={hours}
        onChange={(e) =>
          setTime(setSliderHours(timeMs, parseFloat(e.target.value)))
        }
        className="w-full accent-astral-500 cursor-pointer"
        aria-label="시각"
      />
      <div className="flex justify-between px-1 text-[9px] text-night-500 mb-2">
        <span>0시</span>
        <span>6시</span>
        <span>12시</span>
        <span>18시</span>
        <span>24시</span>
      </div>

      {/* 날짜 피커 */}
      <input
        type="date"
        value={toDateInputValue(timeMs)}
        onChange={(e) => {
          if (e.target.value) setTime(setDatePart(timeMs, e.target.value));
        }}
        className="w-full px-2.5 py-1.5 rounded-lg bg-night-950/60 border border-night-700 text-sm text-night-100 focus:outline-none focus:border-astral-500 transition scheme-dark"
      />

      {/* 액션 버튼 */}
      <div className="mt-2 flex gap-1.5">
        <button
          onClick={() => setLive(!live)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition ${
            live
              ? "bg-astral-500/20 text-astral-200 border border-astral-500/40"
              : "bg-night-800 text-night-200 hover:bg-night-700"
          }`}
        >
          {live ? <Pause size={13} /> : <Play size={13} />}
          {live ? "실시간 정지" : "실시간 재생"}
        </button>
        <button
          onClick={resetToNow}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-night-800 text-night-200 hover:bg-night-700 text-xs transition"
        >
          <RotateCcw size={13} />
          지금
        </button>
      </div>
    </div>
  );
}

export default TimeControls;
