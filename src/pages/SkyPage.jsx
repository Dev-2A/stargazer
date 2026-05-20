import AppShell from "../components/layout/AppShell";
import SkyCanvas from "../components/sky/SkyCanvas";

function SkyPage() {
  return (
    <AppShell>
      <div className="relative h-[calc(100dvh-3.5rem)] lg:h-screen overflow-hidden bg-linear-to-b from-night-900 to-night-950">
        <SkyCanvas />

        {/* 임시 오버레이 — Step 13~15에서 별/별자리/시간 정보로 교체 예정 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-night-900/60 backdrop-blur border border-night-700 text-[11px] text-astral-300/80 pointer-events-none">
          🌌 Three.js 천구 연결됨 · Step 4
        </div>
      </div>
    </AppShell>
  );
}

export default SkyPage;
