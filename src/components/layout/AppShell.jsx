import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  // ESC 키로 드로어 닫기
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen]);

  // 드로어 열린 동안 바디 스크롤 락
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-night-950 text-night-100">
      {/* 📱 모바일 헤더 (lg 미만에서만 표시) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-night-900/95 backdrop-blur border-b border-night-800">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          className="p-2 -ml-2 rounded-lg text-astral-200 hover:bg-night-800 transition"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">🌌</span>
          <span className="text-sm font-semibold text-astral-100">
            Stargazer
          </span>
        </div>
        <div className="w-9" aria-hidden="true" /> {/* 시각 균형용 */}
      </header>

      {/* 🖥️ 데스크탑 고정 사이드바 (lg 이상) */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-72 z-20">
        <Sidebar />
      </aside>

      {/* 📱 모바일 드로어 백드롭 */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-night-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* 📱 모바일 드로어 본체 */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="relative h-full">
          <button
            onClick={closeDrawer}
            aria-label="메뉴 닫기"
            className="absolute top-3.5 right-3 z-10 p-2 rounded-lg text-astral-200 hover:bg-night-800 transition"
          >
            <X size={18} />
          </button>
          <Sidebar onNavigate={closeDrawer} />
        </div>
      </aside>

      {/* 본문 */}
      <main className="lg:pl-72">{children}</main>
    </div>
  );
}

export default AppShell;
