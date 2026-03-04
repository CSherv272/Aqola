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
import { hello, getPostcodeData } from "./lib/api";
import { ofsted_frequency_by_band } from "./lib/bar_graph"
import { crime_rate_by_type_and_area, crime_rate_by_area } from "./lib/line_graph"
import { useState, useEffect } from "react";
import { ChartType } from "./lib/frontend_models";

// import LineGraph from "./components/linegraph";
// import LeafletMap from "./components/Map";
// import Banner from "./components/aqola-banner";

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

// const LineChart = dynamic(() => import("./components/linegraph"), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

export default function Home() {
  //app state variables
  let [selectedPostcodes, setSelectedPostcodes] = useState([]);
  let [selectedDataSet, setSelectedDataSet] = useState("crime_data");

  const handleLineHover = (newValue: string) => {
    setSelectedDataSet(newValue);
    console.log("selected dataset", selectedDataSet);
  };

  const [data, setData] = useState([]);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showBarChart, setShowBarChart] = useState(false);
  let [lineChartData, setLineChartData] = useState<any>(null)
  let [barChartData, setBarChartData] = useState<any>(null)
  const [postcode, setPostcode] = useState([]);

  const getPostcode = async () => {
    const response = await getPostcodeData("CT27QS");
    setPostcode(response);
  };

  // takes the id of the chart required and creates it
  // looks at app state for the values - to be conmpleted
  const handleChartSelection = async (chartType: ChartType) => {
    let selectedDataset = "crime"
    let selectedLsoas = ["E01016024", "E01024040", "E01032810"]
    let selectedPcd = ["DA125JT"]
    let selectedCrimeTypes: string[] = ["Other theft", "Drugs"]
    console.log(chartType)

    switch (chartType) {
      case "line_over_time":
        let line_data = await crime_rate_by_type_and_area(selectedLsoas[0], selectedCrimeTypes)
        setLineChartData(line_data)
        setShowLineChart(!showLineChart)
        break;
      case "bar_frequency":
        let bar_data = await ofsted_frequency_by_band(selectedPcd[0])
        setBarChartData(bar_data.chart)
        setShowBarChart(!showBarChart);
        break;
      case "line_over_time_by_lsoa":
        let line_data_by_lsoa = await crime_rate_by_area(selectedLsoas)
        setLineChartData(line_data_by_lsoa)
        setShowLineChart(!showLineChart)
        break;
    }
  }


  // when data changes, update is printed to console
  useEffect(() => {
    console.log("your data", data);
  }, [data]);

  useEffect(() => {
    const postcode_data = getPostcode();
  }, []);

  useEffect(() => {
    console.log("your postcode data", postcode);
  }, [postcode]);

  // const bar_chart_data_template = {
  //   groups: [
  //     {
  //       name: "CT2 7QS",
  //       bars: [
  //         {
  //           bar_name: "high_risk",
  //           value: 30,
  //           color: "red",
  //         },
  //         {
  //           bar_name: "medium_risk",
  //           value: 12,
  //           color: "yellow",
  //         },
  //         {
  //           bar_name: "low_risk",
  //           value: 40,
  //           color: "blue",
  //         },
  //         {
  //           bar_name: "very_low_risk",
  //           value: 50,
  //           color: "green",
  //         },
  //       ],
  //     },
  //     {
  //       name: "CT2 7QB",
  //       bars: [
  //         {
  //           bar_name: "high_risk",
  //           value: 45,
  //           color: "red",
  //         },
  //         {
  //           bar_name: "medium_risk",
  //           value: 64,
  //           color: "yellow",
  //         },
  //         {
  //           bar_name: "low_risk",
  //           value: 20,
  //           color: "blue",
  //         },
  //         {
  //           bar_name: "very_low_risk",
  //           value: 3,
  //           color: "green",
  //         },
  //       ],
  //     },
  //   ],
  //   title: "Flood data bargraph!",
  //   xlabel: "Postcodes",
  //   ylabel: "Number of Houses at risk",
  // };

  // let crime_data_template = {
  //   chart_type: "line",
  //   type: "crime_data",
  //   area: "postcodes",
  //   chart: {
  //     lines: [
  //       {
  //         line_name: "Drugs",
  //         coords: [
  //           [0, 10],
  //           [1, 20],
  //           [2, 30],
  //         ],
  //         color: "blue",
  //       },
  //       {
  //         line_name: "Robbery",
  //         coords: [
  //           [0, 5],
  //           [1, 15],
  //           [2, 25],
  //         ],
  //         color: "red",
  //       },
  //     ],
  //     title: "Crime by Postcode",
  //     xlabel: "Time (months)",
  //     ylabel: "Number of Crimes",
  //   },
  // };

  return (
    <div className="page-container">
      {/* <Banner onChartSelect={handleChartSelection} /> */}
      {/*trigger is button press*/}
      {showLineChart && lineChartData && <LineChart data={lineChartData} get_line_name={handleLineHover} />}
      {showBarChart && barChartData && <BarChart data={barChartData} />}
      {/* Map wrapper */}
      <div className="map-wrapper w-full h-full">
        <LeafletMap />

      </div>

      <DataSelector />


      {/* Bottom Navigation Overlay */}
      <div className="bottom-nav">


        <button onClick={() => handleChartSelection} className="nav-button"> <i className="fi fi-rs-chart-pie" />    </button>
        <button onClick={() => handleChartSelection("bar_frequency")} className="nav-button"> <i className="fi fi-rs-stats" /> </button>
        <button onClick={() => handleChartSelection("line_over_time")} className="nav-button"> <i className="fi fi-rs-chart-line-up" /> </button>
      </div>
    </div>
  );
}
