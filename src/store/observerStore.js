import { create } from "zustand";

export const DEFAULT_OBSERVER = { lat: 37.5665, lon: 126.978, name: "서울" };

export const useObserverStore = create((set) => ({
  observer: DEFAULT_OBSERVER,
  timeMs: Date.now(),
  live: true, // 실시간 따라가기 (기본 ON)

  setObserver: (observer) => set({ observer }),

  // 시간 수동 설정 → 라이브 자동 해제
  setTime: (time) =>
    set({
      timeMs: time instanceof Date ? time.getTime() : time,
      live: false,
    }),

  // 라이브 틱 (내부용 — 라이브 해제 안 함)
  tickNow: () => set({ timeMs: Date.now() }),

  // "지금" 버튼 → 현재 시각 + 라이브 ON
  resetToNow: () => set({ timeMs: Date.now(), live: true }),

  setLive: (live) =>
    set((s) => ({ live, timeMs: live ? Date.now() : s.timeMs })),
}));
