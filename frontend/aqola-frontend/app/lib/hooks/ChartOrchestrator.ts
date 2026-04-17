import { useAppStore } from "@/app/store/appStore";
import { useState, useEffect } from "react";
import { getAvailableCharts, fetchChartData } from "../chartConfig";
import { chartData } from "../types";

const useChartOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const clearAreas = useAppStore((state) => state.clearAreas);

  const [activeChartId, setActiveChartId] = useState("");
  const [currentChartData, setCurrentChartData] = useState<chartData>(null);

  const availableCharts = getAvailableCharts(selectedDataset);

  useEffect(() => {
    const updateLiveChart = async () => {
      // Only live-update the timeline
      if (activeChartId === "individual_school_ofsted_timeline" && selectedAreas.length > 0) {
        const data = await fetchChartData(activeChartId, selectedAreas);
        setCurrentChartData(data);
      }
    };
    updateLiveChart();
  }, [selectedAreas, activeChartId]);

  const triggerChart = async (chartId: string) => {
    if (activeChartId === chartId) {
      setActiveChartId(""); // toggle off if already showing
      setCurrentChartData(null);
      return;
    }

    if (chartId === "individual_school_ofsted_timeline" && selectedAreas.length === 0) {
      console.warn("A map pin must be selected to view the timeline.");
      return; 
    }

    // Ensure we empty array is passed to the Bar Graph so it fetches all of Kent
    const areasToFetch = chartId === "school_ofsted_frequency" ? [] : selectedAreas;

    const data = await fetchChartData(chartId, areasToFetch);
    setCurrentChartData(data);
    setActiveChartId(chartId);
  };

  return {
    availableCharts,
    activeChartId,
    chartData: currentChartData,
    triggerChart,
  };
};

export { useChartOrchestrator };