import { useAppStore } from "@/app/store/appStore";
import { useState } from "react";
import { getAvailableCharts, fetchChartData } from "../chartConfig";

const useChartOrchestrator = () => {
  // Reads from app store
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);

  // Internal state
  // NOTE: This is not in app store as the graphs being used is only used by page.tsx
  const [activeChartId, setActiveChartId] = useState("");
  const [chartData, setChartData] = useState(null);

  // Figure out the bottom bar buttons
  const availableGraphs = getAvailableCharts(selectedDataset);

  // handles button press. API call and setting of chartdata needed.
  const triggerChart = async (chartId: string) => {
    if (activeChartId === chartId) {
      setActiveChartId(""); // toggle off if already showing
      setChartData(null);

      return;
    }

    const data = await fetchChartData(chartId, selectedAreas);
    console.log("GOT DATA!");
    console.log(data);
    setChartData(data);
    setActiveChartId(chartId);
  };

  return {
    availableGraphs,
    activeChartId,
    chartData,
    triggerChart,
  };
};

export { useChartOrchestrator };
