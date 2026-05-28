import { useState } from "react";
import { Camera, Check } from "lucide-react";
import { format } from "date-fns";
import { useObserverStore } from "../../store/observerStore";
import { composeSkyImage, downloadBlob } from "../../lib/capture";

function CaptureButton({ skyRef }) {
  const observer = useObserverStore((s) => s.observer);
  const timeMs = useObserverStore((s) => s.timeMs);
  const [done, setDone] = useState(false);

  const handleCapture = async () => {
    const glCanvas = skyRef.current?.captureCanvas();
    if (!glCanvas) return;
    try {
      const blob = await composeSkyImage(glCanvas, {
        observerName: observer.name,
        timeMs,
      });
      const stamp = format(new Date(timeMs), "yyyyMMdd_HHmm");
      downloadBlob(blob, `stargazer_${observer.name}_${stamp}.png`);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch (err) {
      console.error("[Stargazer] 캡처 실패:", err);
    }
  };

  return (
    <button
      onClick={handleCapture}
      aria-label="현재 뷰 PNG 저장"
      className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-night-900/70 backdrop-blur border border-night-700 text-astral-200 hover:bg-night-800 hover:border-astral-500/50 text-sm transition shadow-lg"
    >
      {done ? (
        <Check size={16} className="text-astral-300" />
      ) : (
        <Camera size={16} />
      )}
      <span className="hidden sm:inline">{done ? "저장됨" : "PNG 저장"}</span>
    </button>
  );
}

export default CaptureButton;
