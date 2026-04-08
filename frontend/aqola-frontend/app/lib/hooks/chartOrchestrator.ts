import { useAppStore } from "@/app/store/appStore";
import { useState, useEffect } from "react";
import { getAvailableCharts, fetchChartData } from "../chartConfig";
import { chartData } from "../types";
// import { StateDefinition } from "@/app/store/appStore";

const useChartOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const clearAreas = useAppStore((state) => state.clearAreas);
  const addGraph = useAppStore((state) => state.addGraph);
  const getCharts = useAppStore((state) => state.getCharts);
  const findChartFromName = useAppStore((state) => state.findChartFromName);
  const focusChart = useAppStore((state) => state.focusChart);
 
  const [activeChartId, setActiveChartId] = useState("");
  const [currentChartData, setCurrentChartData] = useState<chartData>(null);

  const availableCharts = getAvailableCharts(selectedDataset);

  // Updates the currently active chart when selectedAreas changes, but only for the individual school timeline
  const updateLiveChart = async () => {
    // Only live-update the timeline
    const data = await fetchChartData(activeChartId, selectedAreas);
    setCurrentChartData(data);
  };

  useEffect(() => {
    updateLiveChart();
  }, [selectedAreas, activeChartId]);

  // will need to change the close button to new function
  // Update/Create chart based on ID
  const triggerChart = async (chartId: string) => {
    console.log("Chart id: " + chartId)
    const data = await fetchChartData(chartId, selectedAreas);
    setCurrentChartData(data);
    setActiveChartId(chartId);
    
    // if not in the stack, add the graph
    // else, focus graph
    if (findChartFromName(chartId) === undefined){ addGraph(chartId); console.log("Chart id found!")}
    else { focusChart(chartId) }
  };

  return {
    availableCharts,
    activeChartId,
    chartData: currentChartData,
    triggerChart,
  };
};

export { useChartOrchestrator };