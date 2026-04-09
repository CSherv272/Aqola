import { useAppStore } from "@/app/store/appStore";
import { useState, useEffect, useRef } from "react";
import { getAvailableCharts, fetchChartData } from "../chartConfig";
import { chartData } from "../types";
import { get, set } from "lodash";
// import { StateDefinition } from "@/app/store/appStore";

const useChartOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const clearAreas = useAppStore((state) => state.clearAreas);
  const addGraph = useAppStore((state) => state.addGraph);
  const getCharts = useAppStore((state) => state.getCharts);
  const findChartFromName = useAppStore((state) => state.findChartFromName);
  const focusChart = useAppStore((state) => state.focusChart);
  const removeChart = useAppStore((state) => state.removeChart);
  const getFocusedChart = useAppStore((state) => state.getFocusedChart);
  const updateChartState = useAppStore((state) => state.updateChartState);
 
  const [activeChartId, setActiveChartId] = useState("");
  const [currentChartData, setCurrentChartData] = useState<chartData>(null);

  const availableCharts = getAvailableCharts(selectedDataset);

  // Updates the currently active chart when selectedAreas changes
  const updateLiveChart = async () => {
    const data = await fetchChartData(activeChartId, selectedAreas);
    setCurrentChartData(data);
    updateChartState(activeChartId);
  };


  // Live update of the currently active chart whenever selected areas change
  useEffect(() => {
    if (activeChartId === getFocusedChart()?.graphName) {
      updateLiveChart();
    }
  }, [selectedAreas]);

  const closeChart = (chartId: string) => {
    setCurrentChartData(null);
    removeChart(chartId);
    setActiveChartId(getFocusedChart()?.graphName ?? "");
  }

  // Create/Focus chart based on ID
  const triggerChart = async (chartId: string) => {
    // if not in the stack, add the graph
    // else, focus graph
    if (findChartFromName(chartId) === undefined){ addGraph(chartId); console.log("Added chart: ", chartId);}
    else { focusChart(chartId);} 
    
    const data = await fetchChartData(chartId, selectedAreas);
    setCurrentChartData(data);
    setActiveChartId(chartId);
  };

  return {
    availableCharts,
    activeChartId,
    setActiveChartId,
    chartData: currentChartData,
    triggerChart,
    closeChart,
    updateLiveChart,
  };


};

export { useChartOrchestrator };