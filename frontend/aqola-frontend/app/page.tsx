// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
// import Banner from "./components/aqola-banner";
import BarChart from "./components/bar_chart";
import LineChart from "./components/line_chart";
import DataSelector from "./components/DataSelector";
// import LineGraph from "./components/linegraph";
import { ofsted_frequency_by_band } from "./lib/bar_graph";
import {
  crime_rate_by_type_and_area,
  crime_rate_by_area,
} from "./lib/line_graph";
import { useState } from "react";
import { ChartType } from "./lib/frontend_models";
import { ChartControls } from "./components/ChartControls";
import { useChartOrchestrator } from "./lib/hooks/chartOrchestrator";
import { getChartDefinition } from "./lib/chartConfig";

// import LineGraph from "./components/linegraph";
// import LeafletMap from "./components/Map";
// import Banner from "./components/aqola-banner";

import { useAppStore } from "./store/appStore";

//dynamically import banner from banner component
const Banner = dynamic(() => import("./components/aqola-banner"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

//dynamically import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/maps/maps"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  //app state variables
  const [selectedDataSet, setSelectedDataSet] = useState("crime_data"); // Needs to be changed, to use actual app state

  const handleLineHover = (newValue: string) => {
    setSelectedDataSet(newValue);
    console.log("selected dataset", selectedDataSet);
  };

  // page.tsx
  const { availableCharts, activeChartId, chartData, triggerChart } =
    useChartOrchestrator();

  const renderChart = () => {
    console.log("CHARTING! ->" + activeChartId + " : " + chartData);
    if (!activeChartId || !chartData || !chartData.chart) return null;
    const chart = getChartDefinition(activeChartId);
    if (!chart) return null;

    switch (chart.chartComponent) {
      case "line":
        return <LineChart data={chartData} get_line_name={handleLineHover} />;
      case "bar":
        return (
          <div className="chart-overlay">
            {<BarChart data={chartData.chart} />}
          </div>
        );
    }
  };
  return (
    <div className="page-container">
      <div className="map-wrapper">
        <LeafletMap />

        {renderChart()}
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
