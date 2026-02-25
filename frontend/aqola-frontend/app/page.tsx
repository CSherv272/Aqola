// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
// import Banner from "./components/aqola-banner";
import BarGraph from "./components/bargraph";
// import LineGraph from "./components/linegraph";
import { hello, getPostcodeData } from "./lib/api";
import { county_ofsted_frequency } from "./lib/bar_graph"
import { postcode_time_frequency_crimetypes } from "./lib/line_graph"
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
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [showBarGraph, setShowBarGraph] = useState(false);
  let [lineGraphData, setLineGraphData] = useState<any>(null)
  let [barGraphData, setBarGraphData] = useState<any>(null)
  const [postcode, setPostcode] = useState([]);

  const getPostcode = async () => {
    const response = await getPostcodeData("CT27QS");
    setPostcode(response);
  };

  // retrieves data through an api.ts function
  const getData = async () => {
    const response = await hello();
    setData(response.message);
    setShowLineGraph(!showLineGraph);
  };

  const handleDataBar = async () => {
    let data = await county_ofsted_frequency()
    setBarGraphData(data.chart)
    setShowBarGraph(!showBarGraph);
  }


  const handleDataLine = async () => {
    let data = await postcode_time_frequency_crimetypes("E01016024")
    setLineGraphData(data)
    console.log(data)
    setShowLineGraph(!showLineGraph)
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
    "Anti-social behaviour": "brown",
    "Bicycle theft": "black",
    "Burglary": "blue",
    "Criminal damage and arson": "pink",
    "Drugs": "cyan",
    "Other crime": "purple",
    "Other theft": "grey",
    "Possession of weapons": "lime",
    "Public order": "teal",
    "Robbery": "red",
    "Shoplifting": "yellow",
    "Theft from the person": "maroon",
    "Vehicle crime": "green",
    "Violence and sexual offences": "orange",
  };

  return (
    <div>
      <Banner lineGraphTrigger={handleDataLine} barGraphTrigger={handleDataBar} apiTrigger={handleDataBar} />{" "}
      {/*trigger is button press*/}
      {showLineGraph && lineGraphData && (
        <LineGraph
          data={lineGraphData}
          colours={colours}
          get_line_name={handleLineHover}
        />
      )}{" "}
      {/*show and hide map*/}
      {showBarGraph && barGraphData && <BarGraph data={barGraphData} />}
      <LeafletMap />
    </div>
  );
}
