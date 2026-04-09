import { create } from "zustand";
import { StateDefinition } from "./stateDefinition";

type AppStore = {
  openGraphs: StateDefinition[],
  selectedAreas: string[];
  selectedDataset: string;

  toggleArea: (area: string) => void;
  clearAreas: () => void;
  setDataset: (dataset: string) => void;
  loadChartState: (graphState: StateDefinition) => void;
  addGraph: (graphName: string) => void;
  removeChart: (graphName: string) => void;
  findChartFromName: (graphName: string) => StateDefinition | undefined;
  focusChart: (graphName: string) => void;
  updateChartState: (graphName: string) => void;
  getFocusedChart: () => StateDefinition | undefined;
  getCharts: () => StateDefinition[];
};

const useAppStore = create<AppStore>((set, get) => ({
  openGraphs: [],
  selectedAreas: [],
  selectedDataset: "",

  // Toggles an area in the selectedAreas array
  toggleArea: (area) =>
    set((state) => ({
      selectedAreas: state.selectedAreas.includes(area)
        ? state.selectedAreas.filter((a) => a !== area)
        : [...state.selectedAreas, area],
    })),

  // Empties the selectedAreas array
  clearAreas: () => set({ selectedAreas: [] }),

  // Sets the selected dataset and clears selected areas
  setDataset: (dataset) => set({
    selectedDataset: dataset,
    selectedAreas: [],
  }),

  // Loads a graph state from openGraphs into the main app state
  loadChartState: (graphState) => set({
    selectedAreas: graphState.selectedAreas,
    selectedDataset: graphState.selectedDataset,
  }),

  // Adds a graph to openGraphs with the current app state
  addGraph: (graphName) => set((state) => ({
    openGraphs: [{
      graphName: graphName,
      selectedAreas: state.selectedAreas,
      selectedDataset: state.selectedDataset,
    }, ...state.openGraphs],
  })),
  
  // Removes a graph from openGraphs by name
  removeChart: (graphName) => set((state) => ({
    openGraphs: state.openGraphs.filter((g) => g.graphName !== graphName),
  })),

  // Finds a graph in openGraphs by name
  findChartFromName: (graphName) => {
    return get().openGraphs.find((g) => g.graphName === graphName);
  },

  // Puts the "focused" graph to the front of the openGraphs array
  focusChart: (graphName) => set((state) => {
    const graphToFocus = state.openGraphs.find((g) => g.graphName === graphName);
    if (!graphToFocus) return state;
    return { openGraphs: [graphToFocus, ...state.openGraphs.filter((g) => g.graphName !== graphName)] };
  }),

  // Updates the state of a graph in openGraphs by name
  updateChartState: (graphName) => set((state) => ({
    openGraphs: state.openGraphs.map((g) =>
      g.graphName === graphName ? { ...g, 
        ...{
          graphName: graphName,
          selectedAreas: get().selectedAreas,
          selectedDataset: get().selectedDataset }
        } : g),
  })),

  getFocusedChart: () => {
    return get().openGraphs[0];
  },

  getCharts: () => {
    return get().openGraphs;
  }
}));

export { useAppStore };