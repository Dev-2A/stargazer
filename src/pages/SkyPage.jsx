import AppShell from "../components/layout/AppShell";
import SkyCanvas from "../components/sky/SkyCanvas";
import ObserverDebugPanel from "../components/controls/ObserverDebugPanel";
import ConstellationInfoPanel from "../components/sky/ConstellationInfoPanel";

function SkyPage() {
  return (
    <AppShell>
      <div className="relative h-[calc(100dvh-3.5rem)] lg:h-screen overflow-hidden bg-linear-to-b from-night-900 to-night-950">
        <SkyCanvas />
        <ObserverDebugPanel />
        <ConstellationInfoPanel />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-night-900/60 backdrop-blur border border-night-700 text-[11px] text-astral-300/80 pointer-events-none">
          드래그로 둘러보기 · 휠로 줌 · 별자리 클릭
        </div>
      </div>
    </AppShell>
  );
}

export default SkyPage;
