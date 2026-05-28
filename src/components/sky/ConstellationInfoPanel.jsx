import { X, BookOpen, Star } from "lucide-react";
import { useSelectionStore } from "../../store/selectionStore";
import { getConstellationDetail } from "../../lib/constellations";

function ConstellationInfoPanel() {
  const selectedId = useSelectionStore((s) => s.selectedConstellation);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const open = !!selectedId;
  const detail = selectedId ? getConstellationDetail(selectedId) : null;

  return (
    <div
      className={`absolute z-20 bottom-0 inset-x-0 lg:inset-x-auto lg:top-20 lg:right-4 lg:bottom-4 lg:w-80 transition-transform duration-300 ease-out ${
        open
          ? "translate-y-0 lg:translate-x-0"
          : "translate-y-full lg:translate-y-0 lg:translate-x-[120%]"
      }`}
    >
      <div className="h-full max-h-[60vh] lg:max-h-none overflow-y-auto rounded-t-2xl lg:rounded-2xl bg-night-900/90 backdrop-blur border border-night-700 shadow-2xl">
        {detail && (
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-astral-300 font-mono">
                    {detail.la}
                  </span>
                  {detail.info?.season && (
                    <span className="px-2 py-0.5 rounded-full bg-astral-500/15 text-astral-200 text-[10px]">
                      {detail.info.season}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-2xl font-bold text-astral-100">
                  {detail.ko}
                </h2>
              </div>
              <button
                onClick={clearSelection}
                aria-label="닫기"
                className="p-2.5 -mr-1 rounded-lg text-night-300 hover:bg-night-800 hover:text-astral-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            {detail.hasInfo ? (
              <>
                <div className="mt-4 flex items-center gap-1.5 text-astral-300 text-xs font-medium">
                  <BookOpen size={13} /> 신화
                </div>
                <p className="mt-1.5 text-sm text-night-100 leading-relaxed">
                  {detail.info.myth}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-astral-300 text-xs font-medium">
                  <Star size={13} /> 주요 별
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {detail.info.stars.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-night-800 text-night-100 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-night-300 leading-relaxed">
                이 별자리의 신화 정보는 아직 준비 중이에요. 선은 하이라이트로
                표시됩니다 💙
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConstellationInfoPanel;
