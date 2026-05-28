import { create } from "zustand";

export const useSelectionStore = create((set) => ({
  selectedConstellation: null, // 약어(string) 또는 null
  selectedStar: null, // 별 객체 또는 null

  selectConstellation: (id) =>
    set({ selectedConstellation: id, selectedStar: null }),
  selectStar: (star) =>
    set({ selectedStar: star, selectedConstellation: null }),
  clearSelection: () =>
    set({ selectedConstellation: null, selectedStar: null }),
}));
