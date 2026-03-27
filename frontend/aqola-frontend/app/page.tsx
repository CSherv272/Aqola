// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import BarChart from "./components/bar_chart";
import LineChart from "./components/line_chart";
import DataSelector from "./components/DataSelector";
// import LineGraph from "./components/linegraph";
import { ofsted_frequency_by_band } from "./lib/bar_graph";
import {
  crime_rate_by_type_and_area,
  crime_rate_by_area,
} from "./lib/line_graph";
import { useState, useEffect, useRef } from "react";
import { ChartType } from "./lib/frontend_models";
import { ChartControls } from "./components/ChartControls";
import { useChartOrchestrator } from "./lib/hooks/chartOrchestrator";
import { getChartDefinition } from "./lib/chartConfig";
import { Window } from "./components/dragBox";
import { getSchools } from "./lib/api";
import { School } from "./lib/api_models";
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
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const clearAreas = useAppStore((state) => state.clearAreas);
   const { availableCharts, activeChartId, chartData, triggerChart } =
    useChartOrchestrator();
  //app state variables
  const [selectedDataSet, setSelectedDataSet] = useState("crime_data"); // Needs to be changed, to use actual app state
// ADDED SCHOOL STATE
  const [schools, setSchools] = useState<School[]>([]);

  // ADDED FETCH LOGIC
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getSchools();
        setSchools(data);
        console.log("Manager: Schools data received!");
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };
    fetchSchools();
  }, []);

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
      // If a chart is currently open, toggle it off so it doesn't bleed over
      // if (activeChartId) {
      //   triggerChart(activeChartId); 
      // }
    // } 
    // // SCENARIO B: User is clicking map pins on the Schools tab
    else if (areasChanged && selectedDataset.toLowerCase() === "schools") {
      if (selectedAreas.length > 0) {
        // Pin selected: Open timeline ONLY if it isn't already open!
        // (This fixes the every-other-click bug)
        if (activeChartId !== "individual_school_ofsted_timeline") {
          triggerChart("individual_school_ofsted_timeline");
        }
    //   } else {
    //     // Pin deselected: Close the timeline if it's currently showing
    //     if (activeChartId === "individual_school_ofsted_timeline") {
    //       triggerChart("individual_school_ofsted_timeline"); // Toggles it off
    //     }
    //   }
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
        <LeafletMap schools={schools} />

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
