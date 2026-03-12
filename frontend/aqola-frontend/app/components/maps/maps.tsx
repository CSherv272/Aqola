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

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PostcodePolygons } from "./postcode_polygons";
import { School } from "../../lib/api_models";
import { useAppStore } from "../../store/appStore";

// Marker icon colour red state when selected
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Marker icon colour blue state default
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Interface ensures page.tsx can send the school array
interface MapProps {
  schools: School[];
}

export default function Map({ schools }: MapProps) {
  // To use AppState
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const clearAreas = useAppStore((state) => state.clearAreas);
  const addArea = useAppStore((state) => state.addArea);
  
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
      
      {selectedDataset === "Schools" && recentSchools.map((school) => {
        const urnString = String(school.urn);
        
        //  Check if this marker is in the AppState
        const isSelected = selectedAreas.includes(urnString);

        return (
          <Marker 
            key={school.urn} 
            position={[school.latitude, school.longitude]}
            // 3. Visual proof that the state is working
            icon={isSelected ? redIcon : blueIcon}
            eventHandlers={{
              click: () => {
                // Update the AppState when clicked
                clearAreas(); 
                addArea(urnString); 
              }
            }}
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
            {school.ofsted_ranking === 0 || school.ofsted_ranking === -1
            ? "Not judged"
            : school.ofsted_ranking ?? "N/A"}
          
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
        );
      })}
    </MapContainer>
  );
}