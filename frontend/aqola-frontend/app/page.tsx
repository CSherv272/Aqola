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

  return (
    <div>
      <Banner trigger={getData} /> {/*trigger is button press*/}
      {showGraph && (
        <LineGraph
          data={crime_data}
          colours={colours}
          get_line_name={handleLineHover}
        />
      )}{" "}
      {/*show and hide map*/}
      <LeafletMap />
    </div>
  );
}
