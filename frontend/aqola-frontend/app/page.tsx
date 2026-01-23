// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import Banner from "./components/aqola-banner";
import LineGraph from "./components/linegraph";
import { useEffect, useState } from "react";
import { hello } from "./lib/api";
import { Html, Head } from "next/document";

//import of the leaflet map from a map component
const LeafletMap = dynamic(() => import("./components/map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [data, setData] = useState([])
  const [showMap, setShowMap] = useState(false)


  // retrieves data through an api.ts function
  const getData = async () => {
    const response = await hello()
    setData(response.message)
    setShowMap(!showMap)
  }

  // when data changes, update is printed to console
  useEffect(() => {
    console.log("your data", data)
  }, [data])


  return (
    <html>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" sizes="any" />
      </head>
      <body>
        <div>
          <Banner trigger={getData} /> {/*trigger is button press*/}
          {showMap && <LineGraph />} {/*show and hide map*/}
          <LeafletMap />
        </div>
      </body>
    </html>
  );
}