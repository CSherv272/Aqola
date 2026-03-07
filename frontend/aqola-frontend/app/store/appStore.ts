import { PolygonStore } from "../lib/types";
import { create } from "zustand";

type AppState = {
  selectedPolygons: PolygonStore[];
  selectedDataset: string;

  addPolygon: (polygon: PolygonStore) => void;
  clearPolygons: () => void;
  setDataset: (dataset: string) => void;
};

const useAppStore = create<AppState>((set) => ({
  selectedPolygons: [],
  selectedDataset: "Crime", // we default to crime dataset
  addPolygon: (polygon: PolygonStore) =>
    set((state) => ({
      selectedPolygons: [...state.selectedPolygons, polygon],
    })),

  clearPolygons: () => set({ selectedPolygons: [] }),

  setDataset: (dataset: string) => set({ selectedDataset: dataset }),
}));

export { useAppStore };
