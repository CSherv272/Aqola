import { useActiveAreaLayer, useAppStore } from "@/app/store/AppStore";
import { useState, useEffect, useRef } from "react";
import { getAvailableCharts } from "../ChartConfig";
import { find } from "lodash";

const useChartOrchestrator = () => {
  // AppStore Variable Refs
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const charts = useAppStore((state) => state.openCharts);

  // AppStore Method Refs
  const clearAreas = useAppStore((state) => state.clearAreas);
  const addChart = useAppStore((state) => state.addChart);
  const addAreas = useAppStore((state) => state.addAreas);
  const findChartFromName = useAppStore((state) => state.findChartFromName);
  const focusChart = useAppStore((state) => state.focusChart);
  const removeChart = useAppStore((state) => state.removeChart);
  const getFocusedChart = useAppStore((state) => state.getFocusedChart);
  const updateChartState = useAppStore((state) => state.updateChartState);
  const setDataset = useAppStore((state) => state.setDataset);

  const [activeChartId, setActiveChartId] = useState(""); // determines if chart is active
  // mainly used for determining if the user has changed dataset
  const availableCharts = getAvailableCharts(selectedDataset);

  // Terminology:
  //      Active chart and focused chart - mean the same thing. The chart that is to be interacted with

  // Update current chart and selected areas when dataset changes
  useEffect(() => {
    // Checks if the user has changed the dataset via the dropdown
    if (selectedDataset !== getFocusedChart()?.selectedDataset) {
      // clearAreas();
      setActiveChartId("");
    }
  }, [selectedDataset]);

  // Update activeChart ID when stack changes
  // Keeps local ref up to date
  useEffect(() => {
    setActiveChartId(getFocusedChart()?.chartName ?? "");
  }, [charts]);

  // Update selected areas and dataset when active chart updates
  useEffect(() => {
    // If there is an active chart, change the dataset match
    const ds = findChartFromName(activeChartId)?.selectedDataset;
    if (ds) {
      setDataset(ds);
    }
    addAreas(findChartFromName(activeChartId)?.selectedAreas ?? []);
  }, [activeChartId]);

  // Update chart state if the active chart's dataset is the same as the user selected dataset
  const updateLiveChart = async () => {
    if (findChartFromName(activeChartId)?.selectedDataset == selectedDataset) {
      updateChartState(activeChartId);
    }
  };
  // Updates the currently active chart when selectedAreas changes
  useEffect(() => {
    if (activeChartId === getFocusedChart()?.chartName) {
      updateLiveChart();
    }
  }, [selectedAreas]);

  // Removes chart from stack, and refocuses, clears currently selected areas
  const closeChart = (chartId: string) => {
    removeChart(chartId);
    setActiveChartId(getFocusedChart()?.chartName ?? "");
    clearAreas();
  };

  // Create/Focus chart based on ID
  const triggerChart = async (chartId: string) => {
    // if not in the stack, add the chart and set it as activeChartId
    if (findChartFromName(chartId) === undefined) {
      addChart(chartId);
      setActiveChartId(chartId);
    }
    // else, focus chart in stack and set as activeChartId
    else {
      focusChart(chartId);
      setActiveChartId(chartId);
    }
    setActiveChartId(chartId);
  };

  const activeLayer = useActiveAreaLayer();
  const prevAreaType = useRef(activeLayer?.areaType);

  useEffect(() => {
    // If the area type changes and there is no active chart
    // Then clear the selected areas as they won't be relevant anymore.
    if (activeLayer?.areaType !== prevAreaType.current && !activeChartId) {
      console.log("Area type changed, clearing selected areas");
      clearAreas();
      prevAreaType.current = activeLayer?.areaType ?? undefined;
    }
  }, [activeLayer?.areaType]);

  return {
    availableCharts,
    activeChartId,
    setActiveChartId,
    triggerChart,
    closeChart,
    updateLiveChart,
  };
};

export { useChartOrchestrator };
