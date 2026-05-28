import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { useObserverStore } from "../../store/observerStore";
import { searchCities } from "../../data/cities";

function LocationInput() {
  const observer = useObserverStore((s) => s.observer);
  const setObserver = useObserverStore((s) => s.setObserver);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);

  const results = open && query.trim() ? searchCities(query) : [];

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (city) => {
    setObserver({ lat: city.lat, lon: city.lon, name: city.ko });
    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const onKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="px-1">
      <div className="flex items-center gap-1.5 px-2 mb-1.5 text-sm text-night-200">
        <MapPin size={14} className="text-astral-300" />
        <span className="font-medium">위치</span>
        <span className="ml-auto text-xs text-astral-300">{observer.name}</span>
      </div>

      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-night-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          placeholder="도시 검색 (예: 서울, Paris)"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-night-950/60 border border-night-700 text-sm text-night-100 placeholder:text-night-500 focus:outline-none focus:border-astral-500 transition"
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 rounded-lg border border-night-700 bg-night-900/95 p-1">
          {results.map((c, i) => (
            <li key={`${c.ko}-${c.en}`}>
              <button
                onClick={() => choose(c)}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-sm transition ${
                  i === highlight
                    ? "bg-astral-500/20 text-astral-100"
                    : "text-night-100 hover:bg-night-800"
                }`}
              >
                <span>{c.ko}</span>
                <span className="text-[10px] text-night-400">{c.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <p className="mt-1.5 px-2 py-2 text-xs text-night-500">
          검색 결과가 없어요. 다른 도시명을 입력해보세요.
        </p>
      )}
    </div>
  );
}

export default LocationInput;
