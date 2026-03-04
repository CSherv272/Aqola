// // Source - https://stackoverflow.com/a
// // Posted by ffrosch, modified by community. See post 'Timeline' for change history
// // Retrieved 2026-01-15, License - CC BY-SA 4.0

// "use client";

// import "leaflet-defaulticon-compatibility";

// import { PostcodePolygons } from "./postcode_polygons";

// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// export default function Map() {
//   const position: [number, number] = [51.1, 0.79];

//   return (
//     <MapContainer
//       center={position}
//       zoom={10}
//       scrollWheelZoom={true}
//       dragging={true}
//       style={{ height: "100vh", width: "100%"}}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
//         url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
//       />
//       <PostcodePolygons />
//       <Marker position={position}>
//         <Popup>
//           This Marker icon is displayed correctly with{" "}
//           <i>leaflet-defaulticon-compatibility</i>.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PostcodePolygons } from "./postcode_polygons";
import { School } from "../../lib/api_models"; 

// Interface ensures page.tsx can send the school array
interface MapProps {
  schools: School[];
}

export default function Map({ schools }: MapProps) {
  // default center for the Kent/Canterbury area
  const position: [number, number] = [51.2787, 1.0789];

const recentSchools = schools.filter(
    (school) => school.year_range === "2024-2025"
  );

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%"}}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      <PostcodePolygons />

      {/*Map markers for most recent schools */}
      {recentSchools.map((school) => (
  <Marker 
    key={school.urn} 
    position={[school.latitude, school.longitude]}
  >
    <Popup>
      <div className="text-black p-1" style={{ minWidth: '220px' }}>
        <h3 className="font-bold text-lg border-b border-gray-200 mb-2 pb-1">
          {school.school_name}
        </h3>
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <span className="text-gray-500 font-medium">URN:</span> 
          <span>{school.urn}</span>
          
          <span className="text-gray-500 font-medium">Postcode:</span> 
          <span>{school.postcode}</span>
          
          <span className="text-gray-500 font-medium">Ofsted:</span> 
            {school.ofsted_ranking ?? "N/A"}
          
          <span className="text-gray-500 font-medium">Gender:</span> 
          <span>{school.gender}</span>
          
          <span className="text-gray-500 font-medium">Year Range:</span> 
          <span>{school.year_range}</span>
          
          <span className="text-gray-500 font-medium">Education level:</span>
            {[
              school.is_primary && "Primary",
              school.is_secondary && "Secondary",
              school.is_post16 && "Post-16"
            ].filter(Boolean).join(", ") || "None"}

          <span className="text-gray-500 font-medium">LSOA ID:</span> 
          <span className="text self-center">{school.lsoa_id}</span>
        </div>
      </div>
    </Popup>
  </Marker>
))}
    </MapContainer>
  );
}