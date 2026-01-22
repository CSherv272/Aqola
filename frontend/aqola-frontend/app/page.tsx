// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import dynamic from "next/dynamic";
import Banner from "./components/aqola-banner";
import D3Test from "./components/simple-d3";
import { useState } from "react";

const LazyMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const [data, setData] = useState([])
const getData = async() => {
    const response = await fetch("http://localhost:8000/")
    setData(await response.json())
    console.log(data)
}
useState(getData())

export default function Home() {
  return (
    <div>
      <Banner />
      <LazyMap />
      <D3Test />
    </div>
  );
}
