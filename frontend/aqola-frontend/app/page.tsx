"use client";

import dynamic from "next/dynamic";
import DatasetSelector from "./components/DatasetSelector";
import { ChartControls } from "./components/ChartControls";
import Charts from "./components/charts/Charts";
import MinimisedChartList from "./components/charts/MinimisedChartList";

//dynamically import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/maps/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {

  return (
    <div className="page-container">
      {/* Map */}
      <div className="map-wrapper">
        <LeafletMap />
        <Charts />
        <div className="minimised-container">
          <MinimisedChartList />
        </div>
      </div>

      {/* Dropdown for dataset selection */}
      <DatasetSelector />

      {/* Toolbar for available charts */}
      <ChartControls />
    </div>
  );
}
