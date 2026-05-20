import AppShell from "../components/layout/AppShell";

function SkyPage() {
  return (
    <AppShell>
      <div className="min-h-[calc(100dvh-3.5rem)] lg:min-h-screen bg-linear-to-b from-night-900 to-night-950 flex items-center justify-center px-6 py-12">
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
    </AppShell>
  );
}

export default SkyPage;
