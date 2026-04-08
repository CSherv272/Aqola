// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import DataSelector from "./components/DataSelector";
import { useState, useEffect, useRef } from "react";
import { ChartControls } from "./components/ChartControls";
import { useChartOrchestrator } from "./lib/hooks/chartOrchestrator";
import { getChartDefinition } from "./lib/chartConfig";
import { Window } from "./components/dragBox";
import { useAppStore } from "./store/appStore";
import renderCharts from "./components/Charts"
import Charts from "./components/Charts"

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

  return (
    <div className="page-container">
      <div className="map-wrapper">
        <LeafletMap />

        {activeChartId && <Window
          triggerChart={triggerChart}
          activeChartId={activeChartId}
          >
          {/* {renderCharts()} */}
          {<Charts />}
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
