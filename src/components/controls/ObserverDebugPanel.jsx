// ⚠️ 임시 디버그 패널 — Step 14(위치)·15(시간)에서 정식 컨트롤로 대체
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MapPin, Clock } from "lucide-react";
import { useObserverStore } from "../../store/observerStore";

const PRESETS = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "시드니", lat: -33.8688, lon: 151.2093 },
  { name: "레이캬비크", lat: 64.1466, lon: -21.9426 },
];

function ObserverDebugPanel() {
  const observer = useObserverStore((s) => s.observer);
  const timeMs = useObserverStore((s) => s.timeMs);
  const setObserver = useObserverStore((s) => s.setObserver);
  const setTime = useObserverStore((s) => s.setTime);
  const resetToNow = useObserverStore((s) => s.resetToNow);

  const date = new Date(timeMs);
  const shift = (h) => setTime(timeMs + h * 3600 * 1000);

  const btn =
    "px-2.5 py-1 rounded-md bg-night-800/80 hover:bg-night-700 text-astral-200 text-xs transition";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-3 rounded-xl bg-night-900/70 backdrop-blur border border-night-700 text-night-100 shadow-lg max-w-[92vw]">
      <div className="flex items-center gap-2 text-sm">
        <MapPin size={14} className="text-astral-300" />
        <span className="font-medium">{observer.name}</span>
        <span className="text-night-500">·</span>
        <Clock size={14} className="text-astral-300" />
        <span>{format(date, "M월 d일 (EEE) HH:mm", { locale: ko })}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button onClick={() => shift(-1)} className={btn}>
          −1시간
        </button>
        <button onClick={() => shift(1)} className={btn}>
          +1시간
        </button>
        <button onClick={() => shift(-24)} className={btn}>
          −1일
        </button>
        <button onClick={() => shift(24)} className={btn}>
          +1일
        </button>
        <button onClick={resetToNow} className={btn}>
          지금
        </button>
        <span className="mx-1 w-px h-4 bg-night-700" />
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => setObserver(p)}
            className={`${btn} ${
              observer.name === p.name
                ? "ring-1 ring-astral-400 text-astral-100"
                : ""
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[10px] text-night-500">
        ⚠️ 임시 패널 — Step 14·15에서 정식 컨트롤로 교체
      </p>
    </div>
  );
}

export default ObserverDebugPanel;
