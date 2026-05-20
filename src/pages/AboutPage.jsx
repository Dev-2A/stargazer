import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="min-h-screen bg-night-950 text-night-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-sm text-astral-300 hover:text-astral-200 transition"
        >
          ← 천구로 돌아가기
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-astral-100">
          🌌 Stargazer 소개
        </h1>

        <p className="mt-4 text-night-200 leading-relaxed">
          위치와 시간을 입력하면 그 시점의 하늘을 Three.js로 렌더링하는
          인터랙티브 별자리 시뮬레이터. 별을 클릭하면 정보, 시간 슬라이더를 끌면
          별이 회전, 88개 별자리 선과 신화 정보까지.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-astral-200">기술 스택</h2>
          <ul className="mt-3 space-y-1 text-sm text-night-200 list-disc list-inside marker:text-astral-400">
            <li>React 19 + Vite 7 + Tailwind CSS v4</li>
            <li>Three.js — 3D 천구 렌더링</li>
            <li>astronomy-engine — 천체 좌표 계산</li>
            <li>HYG Star Catalog v3 — 별 데이터 (~9,000개)</li>
            <li>IndexedDB (idb) — 즐겨찾기 저장</li>
            <li>Zustand — 관측자 상태 관리</li>
            <li>date-fns — 한국어 날짜</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-astral-200">로드맵</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="text-night-100">
              <span className="inline-block w-16 text-astral-300">v0.1.0</span>
              별 + 별자리 <span className="text-night-400">(개발 중)</span>
            </li>
            <li className="text-night-300">
              <span className="inline-block w-16 text-night-400">v0.2.0</span>
              행성 + 달의 위상
            </li>
          </ul>
        </section>

        <footer className="mt-16 pt-6 border-t border-night-800 text-xs text-night-400">
          Made with <span className="text-astral-300">💙</span> by{" "}
          <a
            href="https://github.com/Dev-2A"
            className="text-astral-300 hover:text-astral-200"
            target="_blank"
            rel="noreferrer"
          >
            Dev-2A
          </a>
        </footer>
      </div>
    </div>
  );
}

export default AboutPage;
