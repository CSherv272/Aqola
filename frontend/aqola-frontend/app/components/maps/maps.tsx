// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import "leaflet-defaulticon-compatibility";

import { PostcodePolygons } from "./postcode_polygons";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  const position: [number, number] = [51.1, 0.79];

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      dragging={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      <PostcodePolygons />
      <Marker position={position}>
        <Popup>
          This Marker icon is displayed correctly with{" "}
          <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
