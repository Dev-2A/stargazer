import { create } from "zustand";

export const DEFAULT_OBSERVER = { lat: 37.5665, lon: 126.978, name: "서울" };

// time은 epoch ms(number)로 저장 - 불변성·비교가 깔끔하고 직렬화에도 유리
export const useObserverStore = create((set) => ({
  observer: DEFAULT_OBSERVER,
  timeMs: Date.now(),

  setObserver: (observer) => set({ observer }),
  setTime: (time) =>
    set({ timeMs: time instanceof Date ? time.getTime() : time }),
  resetToNow: () => set({ timeMs: Date.now() }),
}));
