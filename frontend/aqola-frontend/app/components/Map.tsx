<<<<<<< HEAD
// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

// IMPORTANT: the order matters!
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  const position : [number, number] = [51.505, -0.09]

  return (
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "600px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.
          </Popup>
        </Marker>
      </MapContainer>
  );
}
=======
// Source - https://stackoverflow.com/a
// Posted by ffrosch, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-15, License - CC BY-SA 4.0

"use client";

import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  const position: [number, number] = [51.1, 0.79]

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      dragging={true}
      style={{ height: "1000px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
>>>>>>> main
