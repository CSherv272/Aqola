// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import Banner from "./components/aqola-banner";
import DataSelector from "./components/DataSelector";
import LineGraph from "./components/linegraph";
import { useEffect, useState } from "react";
import { hello, getPostcodeData } from "./lib/api";
{/*import { Html, Head } from "next/document"; */}

//import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [data, setData] = useState([])
  const [showGraph, setShowGraph] = useState(false)
  const [postcode, setPostcode] = useState([])

  const getPostcode = async () => {
    const response = await getPostcodeData("CT27QS")
    setPostcode(response)
  }


  // retrieves data through an api.ts function
  const getData = async () => {
    const response = await hello()
    setData(response.message)
    setShowGraph(!showGraph)
  }

  // when data changes, update is printed to console
  useEffect(() => {
    console.log("your data", data)
  }, [data])

  useEffect(() => {
    const postcode_data = getPostcode();
  }, [])

  useEffect(() => {
    console.log("your postcode data", postcode)
  }, [postcode])

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
      {/*<Banner trigger={getData} /> {/*trigger is button press*/} 
      {showGraph && <LineGraph />} {/*show and hide map*/}

      {/* Map wrapper */}
      <div className="map-wrapper">
        <LeafletMap />

      </div>

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