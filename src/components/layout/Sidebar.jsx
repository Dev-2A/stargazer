import { Link, useLocation } from "react-router-dom";
import { Sparkles, Clock, Star, Info } from "lucide-react";
import LocationInput from "../controls/LocationInput";

function GithubMark({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: "/", label: "천구", icon: Sparkles },
  { to: "/about", label: "소개", icon: Info },
];

const PLACEHOLDERS = [
  { icon: Clock, label: "시간", hint: "Step 15에서 슬라이더 + 피커" },
  { icon: Star, label: "즐겨찾기", hint: "Step 16에서 IndexedDB 저장" },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col bg-night-900 border-r border-night-800">
      {/* 브랜드 */}
      <div className="px-6 py-5 border-b border-night-800">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            🌌
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-astral-100">Stargazer</h1>
            <p className="text-[10px] text-night-400 font-mono">v0.1.0</p>
          </div>
        </Link>
      </div>

      {/* 네비 */}
      <nav className="px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-astral-500/15 text-astral-200 font-medium"
                  : "text-night-200 hover:bg-night-800 hover:text-astral-200"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-night-800" />

      {/* 관측 컨트롤 */}
      <div className="px-3 py-4 space-y-3 flex-1 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase tracking-wider text-night-500 font-semibold">
          관측 컨트롤
        </p>

        <LocationInput />

        {PLACEHOLDERS.map(({ icon: Icon, label, hint }) => (
          <div
            key={label}
            className="px-3 py-3 rounded-lg border border-dashed border-night-700 bg-night-950/40"
          >
            <div className="flex items-center gap-2 text-sm text-night-300">
              <Icon size={14} strokeWidth={2} className="text-night-500" />
              <span className="font-medium">{label}</span>
            </div>
            <p className="mt-1 text-[10px] text-night-500 leading-relaxed">
              {hint}
            </p>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-6 py-4 border-t border-night-800 text-[11px] text-night-400 space-y-1.5">
        <a
          href="https://github.com/Dev-2A/stargazer"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-astral-300 transition"
        >
          <GithubMark size={12} />
          Dev-2A/stargazer
        </a>
        <p>
          Made with <span className="text-astral-300">💙</span>
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
