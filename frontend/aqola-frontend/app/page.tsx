"use client";

import dynamic from "next/dynamic";
import DatasetSelector from "./components/DatasetSelector";
import { ChartControls } from "./components/ChartControls";
import { useChartOrchestrator } from "./lib/hooks/chartOrchestrator";
import Charts from "./components/Charts"

//dynamically import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/maps/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const { availableCharts, activeChartId, triggerChart } = useChartOrchestrator();
  return (
    <div className="page-container">
      {/* Map */}
      <div className="map-wrapper">
        <LeafletMap />
        <Charts />
      </div>

      {/* Dropdown for dataset selection */}
      <DatasetSelector />

      {/* Toolbar for available charts */}
      <ChartControls
        availableCharts={availableCharts}
        activeChartId={activeChartId}
        triggerChart={triggerChart}
      />
    </div>
  );
}
