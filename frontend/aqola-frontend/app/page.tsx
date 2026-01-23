// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import Banner from "./components/aqola-banner";
import D3Test from "./components/simple-d3";
import api from "./lib/api";
import { useEffect, useState } from "react";

const LazyMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [data, setData] = useState([])
  const [showMap, setShowMap] = useState(true) // due to data changing from undefined to [] on render, this turns to false. So map is not visible to user initially

  const getData = async () => {
    const response = await api.get("http://localhost:8000/")
    setData(await response.data.message)
  }

  useEffect(() => {
    console.log("your data", data)
    setShowMap(!showMap)
  }, [data])


  return (
    <div>
      <Banner trigger={getData} />
      {showMap && <D3Test />}
      <LazyMap />
    </div>
  );
}