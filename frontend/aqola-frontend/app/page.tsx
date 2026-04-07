// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import BarChart from "./components/bar_chart";
import LineChart from "./components/line_chart";
import DataSelector from "./components/DataSelector";
import { useState, useEffect, useRef } from "react";
import { ChartControls } from "./components/ChartControls";
import { useChartOrchestrator } from "./lib/hooks/chartOrchestrator";
import { getChartDefinition } from "./lib/chartConfig";
import { Window } from "./components/dragBox";
import { useAppStore } from "./store/appStore";

//dynamically import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/maps/maps"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const clearAreas = useAppStore((state) => state.clearAreas);
  const { availableCharts, activeChartId, chartData, triggerChart } = useChartOrchestrator();
  const [selectedDataSet, setSelectedDataSet] = useState("crime_data"); // Needs to be changed, to use actual app state

// Smarter Watcher using Refs to track changes
  const prevAreasRef = useRef(selectedAreas);
  const prevDatasetRef = useRef(selectedDataset);

  useEffect(() => {
    const datasetChanged = prevDatasetRef.current !== selectedDataset;
    const areasChanged = prevAreasRef.current !== selectedAreas;

    // SCENARIO A: User switched datasets (e.g., Schools -> Crime)
    if (datasetChanged) {
      if (selectedDataset.toLowerCase() !== "schools") {
        clearAreas(); // Wipe the red map pins
      }
    // // SCENARIO B: User is clicking map pins on the Schools tab
    else if (areasChanged && selectedDataset.toLowerCase() === "schools") {
      if (selectedAreas.length > 0) {
        // Pin selected: Open timeline ONLY if it isn't already open!
        // (This fixes the every-other-click bug)
        if (activeChartId !== "individual_school_ofsted_timeline") {
          triggerChart("individual_school_ofsted_timeline");
        }
    }}}

    // Update refs for the next render
    prevAreasRef.current = selectedAreas;
    prevDatasetRef.current = selectedDataset;
  }, [selectedAreas, selectedDataset, activeChartId]);


  const handleLineHover = (newValue: string) => {
    setSelectedDataSet(newValue);
    console.log("selected dataset", selectedDataSet);
  };

  const renderChart = () => {
    // console.log("CHARTING! ->" + activeChartId + " : " + chartData);
    if (!activeChartId || !chartData || !chartData.chart) return null;
    const chart = getChartDefinition(activeChartId);
    if (!chart) return null;

    switch (chart.chartComponent) {
      case "line":
        return (
          // <div className={"chart-overlay"}>
            <LineChart data={chartData} get_line_name={handleLineHover} />
          // </div>
        )
      case "bar":
        return (
          // <div className="chart-overlay">
            <BarChart data={chartData.chart} />
          // </div>
        );
    }
  };
  
  return (
    <div className="page-container">
      <div className="map-wrapper">
        <LeafletMap />

        {activeChartId && <Window
          triggerChart={triggerChart}
          activeChartId={activeChartId}
          >
          {renderChart()}
          {/* <div>hello there</div> */}
        </Window>}
        
      </div>


      
      <DataSelector />

      <ChartControls
        availableCharts={availableCharts}
        activeChartId={activeChartId}
        triggerChart={triggerChart}
      />
    </div>
  );
}
