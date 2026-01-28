// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import "leaflet-defaulticon-compatibility";
import { useState } from "react";

import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import * as data from "../lib/ME.json"

export default function Map() {
  const position: [number, number] = [51.1, 0.79]
  const polygon: LatLngExpression[] = [
    [51.1, 0.79],
    [50.9, 0.79],
    [51.1, 0.89],
  ]

  let geom : LatLngExpression[] = data.features[0].geometry.coordinates

  // function getPostcodes(){
  //   // console.log(data.features[0].properties.name)
  //   for (const postcode of data.features){
  //     // console.log(postcode.properties.name)
  //     geom = postcode.geometry.coordinates
  //   }
  // }

  // useState(() => {
  //   getPostcodes()
  // });

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={false}
      dragging={false}
      style={{ height: "1000px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.</Popup>
      </Marker>

      <Polygon pathOptions={{color : "purple"}} positions={geom} />

    </MapContainer>
  );
}