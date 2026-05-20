import { Link } from "react-router-dom";

function SkyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-night-900 to-night-950 text-night-100 relative">
      {/* 임시 네비 — Step 3에서 AppShell(사이드바 + 드로어)로 대체 예정 */}
      <nav className="absolute top-4 right-4 flex gap-2 text-xs z-10">
        <Link
          to="/"
          className="px-3 py-1.5 rounded-md bg-night-800/60 hover:bg-night-700 text-astral-200 transition"
        >
          천구
        </Link>
        <Link
          to="/about"
          className="px-3 py-1.5 rounded-md bg-night-800/60 hover:bg-night-700 text-astral-200 transition"
        >
          소개
        </Link>
      </nav>

      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h1 className="text-4xl font-bold tracking-tight text-astral-100">
            Stargazer
          </h1>
          <p className="mt-3 text-sm text-astral-300/80">
            위치와 시간으로 그려내는 별의 풍경
          </p>
          <div className="mt-12 text-xs text-night-300">
            🚧 Step 4부터 이 자리에 Three.js 천구가 들어갑니다
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkyPage;
