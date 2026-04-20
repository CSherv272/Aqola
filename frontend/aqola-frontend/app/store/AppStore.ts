import { create } from "zustand";
import { StateDefinition } from "./ChartStateModel";

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
  addAreas: (areas: string[]) => void;
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

  // Add an array of areas, only the ones that aren't in the selectedAreas already
  addAreas: (areas)=>
    set((state) => ({
      selectedAreas: [...state.selectedAreas, ...areas.filter((a) => !state.selectedAreas.includes(a))],
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
    // if not already focused
    if (state.openGraphs[0]?.graphName === graphName) return state;
    console.log("Focusing chart: ", graphName);
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
          selectedAreas: [...get().selectedAreas],
          selectedDataset: get().selectedDataset }
        } : g),
  })),

  // Returns the top chart in the stack
  getFocusedChart: () => {
    return get().openGraphs[0];
  },

  // Returns the full chart stack
  getCharts: () => {
    return get().openGraphs;
  }
}));

export { useAppStore };