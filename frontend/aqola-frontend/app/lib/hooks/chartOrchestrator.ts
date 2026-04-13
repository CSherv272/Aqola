import { useAppStore } from "@/app/store/appStore";
import { useState, useEffect, useRef, use } from "react";
import { getAvailableCharts, fetchChartData } from "../chartConfig";
import { chartData } from "../types";
import { StateDefinition } from "@/app/store/stateDefinition";

const useChartOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const clearAreas = useAppStore((state) => state.clearAreas);
  const addGraph = useAppStore((state) => state.addGraph);
  const addAreas = useAppStore((state) => state.addAreas);
  const getCharts = useAppStore((state) => state.getCharts);
  const findChartFromName = useAppStore((state) => state.findChartFromName);
  const focusChart = useAppStore((state) => state.focusChart);
  const removeChart = useAppStore((state) => state.removeChart);
  const getFocusedChart = useAppStore((state) => state.getFocusedChart);
  const updateChartState = useAppStore((state) => state.updateChartState);
 
  const [activeChartId, setActiveChartId] = useState("");
  // const [currentChartData, setCurrentChartData] = useState<chartData>(null);
  const isDatasetChanging = useRef(false);
  const availableCharts = getAvailableCharts(selectedDataset);

// Update current chart and selected areas when dataset changes
  useEffect(() => {
    isDatasetChanging.current = true;
    clearAreas();
    // setCurrentChartData(null);
    setActiveChartId("");
    isDatasetChanging.current = false;
  }, [selectedDataset]);


  // Update selected areas when active chart updates
  useEffect(() => {
    addAreas(findChartFromName(activeChartId)?.selectedAreas ?? []);
  }, [activeChartId]);

    // Updates the currently active chart when selectedAreas changes
  const updateLiveChart = async () => {
    console.log("Updating live chart for: " + activeChartId);
    // const data = await fetchChartData(activeChartId, selectedAreas);
    // setCurrentChartData(data);
    if(findChartFromName(activeChartId)?.selectedDataset == selectedDataset){
      updateChartState(activeChartId);
    }
  };

  // Live update of the currently active chart whenever selected areas change
  useEffect(() => {
    if (isDatasetChanging.current) {console.log("skipping live update"); return;} // skip live update if we're in the middle of a dataset change, to avoid conflicts
    console.log(getCharts());
    if (activeChartId === getFocusedChart()?.graphName) {
      updateLiveChart();
    }
  }, [selectedAreas]);

  // Removes chart from stack, and refocuses, clears currently selected areas
  const closeChart = (chartId: string) => {
    // setCurrentChartData(null);
    removeChart(chartId);
    setActiveChartId(getFocusedChart()?.graphName ?? "");
    clearAreas();
  }

  // Create/Focus chart based on ID
  const triggerChart = async (chartId: string) => {
    // if not in the stack, add the graph
    // else, focus graph
    if (findChartFromName(chartId) === undefined){ addGraph(chartId); console.log("Added chart: ", chartId);}
    else { 
      focusChart(chartId);
      // set appstore selected areas to match the chart's
    } 
    
    // const data = await fetchChartData(chartId, selectedAreas);
    // setCurrentChartData(data);
    setActiveChartId(chartId);
  };

  return {
    availableCharts,
    activeChartId,
    setActiveChartId,
    // chartData: currentChartData,
    triggerChart,
    closeChart,
    updateLiveChart,
  };


};

export { useChartOrchestrator };