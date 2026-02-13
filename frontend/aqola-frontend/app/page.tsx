// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
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
  let [selectedPostcodes, setSelectedPostcodes] = useState([])
  let [selectedDataSet, setSelectedDataSet] = useState("crime_data")

  const handleClick = (newValue : string) => {
    setSelectedDataSet(newValue)
    console.log("selected dataset", selectedDataSet)
  }

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

  let passData = {
    AA11ABC: {
      x: [5, 6, 9, 20],
      y: [10, 30, 40, 70],
      colour: "red"
    },
    CT11AE: {
      x: [10, 18, 27, 30],
      y: [15, 20, 50, 55],
      colour: "blue"
    },
    TN108FN: {
      x: [14, 19, 25, 37],
      y: [15, 20, 50, 55],
      colour: "green"
    },
    AA102BN: {
      x: [10, 20, 25, 30],
      y: [20, 10, 40, 100],
      colour: "orange"
    }
  };

  return (
    <div>
      <Banner trigger={getData} /> {/*trigger is button press*/}
      {showGraph && <LineGraph data={passData} onChange={handleClick} />} {/*show and hide map*/}
      <LeafletMap />
    </div>
  );
}