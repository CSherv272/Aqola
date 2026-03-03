import { Polygon } from "leaflet";
import { create } from "zustand";

type AppState = {
  selectedPolygons: Polygon[];
  selectedDataset: string | null;

  addPolygon: (polygon: Polygon) => void;
  clearPolygons: () => void;
  setDataset: (dataset: string) => void;
};

const useAppStore = create<AppState>((set) => ({
  selectedPolygons: [],
  selectedDataset: null,
  addPolygon: (polygon: Polygon) =>
    set((state) => ({
      selectedPolygons: [...state.selectedPolygons, polygon],
    })),

  clearPolygons: () => set({ selectedPolygons: [] }),

  setDataset: (dataset: string) => set({ selectedDataset: dataset }),
}));

export { useAppStore };
