// // Source - https://stackoverflow.com/a
// // Posted by ffrosch, modified by community. See post 'Timeline' for change history
// // Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import MapOrchestrator from "./MapOrchestrator"

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
      
    </MapContainer>
  );
}