import { X, Star as StarIcon } from "lucide-react";
import { useSelectionStore } from "../../store/selectionStore";
import { bvToColor, spectralDescription } from "../../lib/celestial";
import { getConstellationName } from "../../data/constellationNames";

function rgbCss([r, g, b]) {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function StarInfoPanel() {
  const star = useSelectionStore((s) => s.selectedStar);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const open = !!star;
  const name = star
    ? star.name || (star.hip ? `HIP ${star.hip}` : `Star ${star.id}`)
    : "";
  const swatch = star ? rgbCss(bvToColor(star.ci)) : "#fff";
  const spectDesc = star ? spectralDescription(star.spect) : null;
  const conName = star?.con ? getConstellationName(star.con).ko : null;
  const ly = star?.dist != null ? (star.dist * 3.26156).toFixed(1) : null;

  return (
    <div
      className={`absolute z-20 bottom-0 inset-x-0 lg:inset-x-auto lg:top-20 lg:right-4 lg:bottom-auto lg:w-80 transition-transform duration-300 ease-out ${
        open
          ? "translate-y-0 lg:translate-x-0"
          : "translate-y-full lg:translate-y-0 lg:translate-x-[120%]"
      }`}
    >
      <div className="rounded-t-2xl lg:rounded-2xl bg-night-900/90 backdrop-blur border border-night-700 shadow-2xl">
        {star && (
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full shadow"
                  style={{
                    backgroundColor: swatch,
                    boxShadow: `0 0 12px ${swatch}`,
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-astral-100">{name}</h2>
                  {conName && (
                    <p className="text-xs text-night-300">{conName} 소속</p>
                  )}
                </div>
              </div>
              <button
                onClick={clearSelection}
                aria-label="닫기"
                className="p-2.5 -mr-1 rounded-lg text-night-300 hover:bg-night-800 hover:text-astral-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-night-400">겉보기 등급</dt>
                <dd className="text-night-100 font-medium">
                  {star.mag.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-night-400">거리</dt>
                <dd className="text-night-100 font-medium">
                  {ly ? `${ly}광년` : "미상"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] text-night-400">분광형</dt>
                <dd className="text-night-100 font-medium">
                  {star.spect || "미상"}
                  {spectDesc && (
                    <span className="ml-1.5 text-xs text-astral-300">
                      · {spectDesc}
                    </span>
                  )}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] text-night-400">적도좌표</dt>
                <dd className="text-night-100 font-mono text-xs">
                  RA {star.ra.toFixed(3)}h · Dec {star.dec.toFixed(2)}°
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-night-500">
              <StarIcon size={11} /> HYG #{star.id}
              {star.hip ? ` · HIP ${star.hip}` : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StarInfoPanel;
