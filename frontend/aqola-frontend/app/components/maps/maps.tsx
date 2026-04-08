// // Source - https://stackoverflow.com/a
// // Posted by ffrosch, modified by community. See post 'Timeline' for change history
// // Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import { MapContainer, TileLayer } from "react-leaflet";
// import "../leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PostcodePolygons } from "./postcode_polygons";
import { SchoolMarkers } from "./school_markers";
import { School } from "../../lib/api_models";
import MapOrchestrator from "./mapOrchestrator"

// interface MapProps {
//   schools: School[];
// }

export default function Map() {
  // default center for the Kent/Canterbury area
  const position: [number, number] = [51.2787, 1.0789];

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapOrchestrator />
      {/* <PostcodePolygons /> */}
      
      {/* Pass the schools array to the containerised markers. 
          The markers component handles its own display logic internally.
      */}
      {/* <SchoolMarkers schools={schools} /> */}
      
    </MapContainer>
  );
}