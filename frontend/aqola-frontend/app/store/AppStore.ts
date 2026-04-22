import { create } from "zustand";
import { StateDefinition } from "./ChartStateModel";

type AppStore = {
  openCharts: StateDefinition[];
  selectedAreas: string[];
  selectedDataset: string;

  toggleArea: (area: string) => void;
  clearAreas: () => void;
  setDataset: (dataset: string) => void;
  loadChartState: (chartState: StateDefinition) => void;
  addChart: (chartName: string) => void;
  removeChart: (chartName: string) => void;
  findChartFromName: (chartName: string) => StateDefinition | undefined;
  focusChart: (chartName: string) => void;
  updateChartState: (chartName: string) => void;
  getFocusedChart: () => StateDefinition | undefined;
  getCharts: () => StateDefinition[];
  addAreas: (areas: string[]) => void;
};

const useAppStore = create<AppStore>((set, get) => ({
  openCharts: [],
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
  addAreas: (areas) =>
    set((state) => ({
      selectedAreas: [
        ...state.selectedAreas,
        ...areas.filter((a) => !state.selectedAreas.includes(a)),
      ],
    })),

  // Empties the selectedAreas array
  clearAreas: () => set({ selectedAreas: [] }),

  // Sets the selected dataset and clears selected areas
  setDataset: (dataset) =>
    set({
      selectedDataset: dataset,
      selectedAreas: [],
    }),

  // Loads a chart state from openCharts into the main app state
  loadChartState: (chartState) =>
    set({
      selectedAreas: chartState.selectedAreas,
      selectedDataset: chartState.selectedDataset,
    }),

  // Adds a chart to openCharts with the current app state
  addChart: (chartName) =>
    set((state) => ({
      openCharts: [
        {
          chartName: chartName,
          selectedAreas: state.selectedAreas,
          selectedDataset: state.selectedDataset,
        },
        ...state.openCharts,
      ],
    })),

  // Removes a chart from openCharts by name
  removeChart: (chartName) =>
    set((state) => ({
      openCharts: state.openCharts.filter((g) => g.chartName !== chartName),
    })),

  // Finds a chart in openCharts by name
  findChartFromName: (chartName) => {
    return get().openCharts.find((g) => g.chartName === chartName);
  },

  // Puts the "focused" chart to the front of the openCharts array
  focusChart: (chartName) =>
    set((state) => {
      // if not already focused
      if (
        state.openCharts[0]?.chartName === chartName &&
        state.selectedDataset === state.openCharts[0]?.selectedDataset
      )
        return state; // if already focused, do nothing
      console.log("Focusing chart: ", chartName);
      const chartToFocus = state.openCharts.find(
        (g) => g.chartName === chartName,
      );
      if (!chartToFocus) return state;
      return {
        openCharts: [
          chartToFocus,
          ...state.openCharts.filter((g) => g.chartName !== chartName),
        ],
      };
    }),

  // Updates the state of a chart in openCharts by name
  updateChartState: (chartName) =>
    set((state) => ({
      openCharts: state.openCharts.map((g) =>
        g.chartName === chartName
          ? {
              ...g,
              ...{
                chartName: chartName,
                selectedAreas: [...get().selectedAreas],
                selectedDataset: get().selectedDataset,
              },
            }
          : g,
      ),
    })),

  // Returns the top chart in the stack
  getFocusedChart: () => {
    return get().openCharts[0];
  },

  // Returns the full chart stack
  getCharts: () => {
    return get().openCharts;
  },
}));

export { useAppStore };
