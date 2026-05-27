import { create } from "zustand";

// 클릭 선택 상태 (Step 13에서 selectedStar 추가 예정)
export const useSelectionStore = create((set) => ({
  selectedConstellation: null, // 별자리 약어(string) 또는 null
  setSelectedConstellation: (id) => set({ selectedConstellation: id }),
  clearSelection: () => set({ selectedConstellation: null }),
}));
