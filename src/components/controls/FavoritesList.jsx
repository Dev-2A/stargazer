import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Star, BookmarkPlus, MapPin, Trash2 } from "lucide-react";
import { useObserverStore } from "../../store/observerStore";
import {
  addFavorite,
  getFavorites,
  deleteFavorite,
} from "../../lib/favoritesDB";

function FavoritesList() {
  const observer = useObserverStore((s) => s.observer);
  const timeMs = useObserverStore((s) => s.timeMs);
  const live = useObserverStore((s) => s.live);
  const setObserver = useObserverStore((s) => s.setObserver);
  const setTime = useObserverStore((s) => s.setTime);

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setFavorites(await getFavorites());
    } catch (err) {
      console.error("[Stargazer] 즐겨찾기 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = async () => {
    const label = `${observer.name} · ${format(new Date(timeMs), "M.d HH:mm", {
      locale: ko,
    })}`;
    try {
      await addFavorite({ label, observer, timeMs, live });
      await refresh();
    } catch (err) {
      console.error("[Stargazer] 즐겨찾기 저장 실패:", err);
    }
  };

  const handleLoad = (fav) => {
    setObserver(fav.observer);
    setTime(fav.timeMs); // setTime이 라이브 자동 해제 → 저장 시점 하늘 고정
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteFavorite(id);
      await refresh();
    } catch (err) {
      console.error("[Stargazer] 즐겨찾기 삭제 실패:", err);
    }
  };

  return (
    <div className="px-1">
      <div className="flex items-center gap-1.5 px-2 mb-1.5 text-sm text-night-200">
        <Star size={14} className="text-astral-300" />
        <span className="font-medium">즐겨찾기</span>
        {favorites.length > 0 && (
          <span className="ml-auto text-[10px] text-night-400">
            {favorites.length}
          </span>
        )}
      </div>

      {/* 현재 뷰 저장 */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-astral-500/15 text-astral-200 border border-astral-500/30 hover:bg-astral-500/25 text-xs transition"
      >
        <BookmarkPlus size={14} />
        현재 뷰 저장
      </button>

      {/* 목록 */}
      <div className="mt-2 space-y-1">
        {loading ? (
          <p className="px-2 py-2 text-[11px] text-night-500">불러오는 중…</p>
        ) : favorites.length === 0 ? (
          <p className="px-2 py-3 text-[11px] text-night-500 leading-relaxed">
            저장된 즐겨찾기가 없어요. 마음에 드는 하늘을 찾으면 저장해보세요 💙
          </p>
        ) : (
          favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => handleLoad(fav)}
              className="group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-night-950/40 hover:bg-night-800 text-left transition"
            >
              <MapPin size={13} className="text-astral-300 shrink-0" />
              <span className="flex-1 text-xs text-night-100 truncate">
                {fav.label}
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label="삭제"
                onClick={(e) => handleDelete(fav.id, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleDelete(fav.id, e);
                }}
                className="shrink-0 p-1 rounded text-night-500 opacity-0 group-hover:opacity-100 hover:text-rose-300 hover:bg-night-700 transition cursor-pointer"
              >
                <Trash2 size={13} />
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default FavoritesList;
