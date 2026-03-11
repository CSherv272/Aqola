import { create } from "zustand";

type AppStore = {
  selectedAreas: string[];
  selectedDataset: string;

  addArea: (area: string) => void;
  removeArea: (area: string) => void;
  toggleArea: (area: string) => void;
  clearAreas: () => void;
  setDataset: (dataset: string) => void;
};

const useAppStore = create<AppStore>((set) => ({
  selectedAreas: [],
  selectedDataset: "Crime",

  addArea: (area) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.includes(area)
        ? state.selectedAreas
        : [...state.selectedAreas, area],
    })),

  // Performance improvement likely here
  removeArea: (area) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.filter((a) => a !== area),
    })),

  toggleArea: (area) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.includes(area)
        ? state.selectedAreas.filter((a) => a !== area)
        : [...state.selectedAreas, area],
    })),

  clearAreas: () => set({ selectedAreas: [] }),

  setDataset: (dataset) => set({ selectedDataset: dataset }),
}));

export { useAppStore };
