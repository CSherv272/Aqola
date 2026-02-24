// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
// import Banner from "./components/aqola-banner";
import DataSelector from "./components/DataSelector";
import BarGraph from "./components/bargraph";
// import LineGraph from "./components/linegraph";
import { hello, getPostcodeData } from "./lib/api";
import { useState, useEffect } from "react";

// import LineGraph from "./components/linegraph";
// import LeafletMap from "./components/Map";
// import Banner from "./components/aqola-banner";

//dynamically import banner from banner component
const Banner = dynamic(() => import("./components/aqola-banner"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

//dynamically import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/maps"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LineGraph = dynamic(() => import("./components/linegraph"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  //app state variables
  let [selectedPostcodes, setSelectedPostcodes] = useState([]);
  let [selectedDataSet, setSelectedDataSet] = useState("crime_data");

  const handleLineHover = (newValue: string) => {
    setSelectedDataSet(newValue);
    console.log("selected dataset", selectedDataSet);
  };

  const [data, setData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [showBarGraph, setShowBarGraph] = useState(false);
  const [postcode, setPostcode] = useState([]);

  const getPostcode = async () => {
    const response = await getPostcodeData("CT27QS");
    setPostcode(response);
  };

  // retrieves data through an api.ts function
  const getData = async () => {
    const response = await hello();
    setData(response.message);
    setShowGraph(!showGraph);
  };

  const showBar = async () => {
    setShowBarGraph(!showBarGraph);
  };

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

  const bar_graph_data_template = {
    groups: [
      {
        name: "CT2 7QS",
        bars: [
          {
            bar_name: "high_risk",
            value: 30,
            color: "red",
          },
          {
            bar_name: "medium_risk",
            value: 12,
            color: "yellow",
          },
          {
            bar_name: "low_risk",
            value: 40,
            color: "blue",
          },
          {
            bar_name: "very_low_risk",
            value: 50,
            color: "green",
          },
        ],
      },
      {
        name: "CT2 7QB",
        bars: [
          {
            bar_name: "high_risk",
            value: 45,
            color: "red",
          },
          {
            bar_name: "medium_risk",
            value: 64,
            color: "yellow",
          },
          {
            bar_name: "low_risk",
            value: 20,
            color: "blue",
          },
          {
            bar_name: "very_low_risk",
            value: 3,
            color: "green",
          },
        ],
      },
    ],
    title: "Flood data bargraph!",
    xlabel: "Postcodes",
    ylabel: "Number of Houses at risk",
  };

  let crime_data = {
    chart_type: "line",
    type: "crime_data",
    area: "postcodes",
    chart: {
      lines: [
        {
          line_name: "Drugs",
          coords: [
            [0, 10],
            [1, 20],
            [2, 30],
          ],
        },
        {
          line_name: "Robbery",
          coords: [
            [0, 5],
            [1, 15],
            [2, 25],
          ],
        },
      ],
      title: "Crime by Postcode",
      xlabel: "Time (months)",
      ylabel: "Number of Crimes",
    },
  };

  let colours = {
    Burglary: "blue",
    Robbery: "red",
    "Vehicle Crime": "green",
    "Violent Crime": "orange",
    "Other Crime": "purple",
    "Anti-social Behaviour": "brown",
    "Criminal Damage": "pink",
    Drugs: "cyan",
    "Public Order": "magenta",
    Shoplifting: "yellow",
    Theft: "grey",
    "Bicycle Theft": "black",
    "Possession of Weapons": "lime",
    "Other Theft": "teal",
    "All Crime": "navy",
    "Criminal Damage and Arson": "maroon",
  };  
  const navButtonPie = () => {
  console.log("Pie chart clicked");
  };

  const navButtonBar = () => {
  console.log("Bar chart clicked");
  };

  const navButtonLine = () => {
  console.log("Line graph clicked");
  };



  return (
    <div className = "page-container">
      <Banner trigger={getData} barGraphTrigger={showBar} />{" "}
      {/*trigger is button press*/}
      {showGraph && (
        <LineGraph
          data={crime_data}
          colours={colours}
          get_line_name={handleLineHover}
        />
      )}{" "}
      {/*show and hide map*/}
      {showBarGraph && <BarGraph data={bar_graph_data_template} />}

      {/* Map wrapper */}
      <div className="map-wrapper">
        <LeafletMap />

      </div>
      
      <DataSelector />
      

      {/* Bottom Navigation Overlay */}
      <div className="bottom-nav">
        

        <button onClick={navButtonPie} className="nav-button"> <i className="fi fi-rs-chart-pie"/>    </button>
        <button onClick={navButtonBar} className="nav-button"> <i className="fi fi-rs-stats"/> </button>
        <button onClick={navButtonLine} className="nav-button"> <i className="fi fi-rs-chart-line-up"/> </button>
      </div>

      
      {/* <div className="data-select-wrapper">
          <label htmlFor="data" className="data-label">Dataset: </label> 
          <select className="data-select" name="data" id="data">
            <option value="Crime">Crime</option>
            <option value="Schools">Schools</option>
            <option value="Flood">Flood</option>
          </select>
      </div> */}
      
      
    </div>
  );
}
