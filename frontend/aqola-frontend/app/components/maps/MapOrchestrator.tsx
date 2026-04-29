import { useAppStore } from "@/app/store/AppStore";
import { SchoolMarkers } from "./SchoolMarkers";
import { getSchools } from "../../lib/Api";
import { useState, useEffect, useActionState } from "react";
import { School } from "../../lib/ApiModels";
import { Polygons } from "./Polygons";
import { useMapEvents } from "react-leaflet";

const MapOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const setZoom = useAppStore((state) => state.setZoom);
  const [schools, setSchools] = useState<School[]>([]);

  // Fetch schools data when the component mounts
  const fetchSchools = async () => {
    try {
      const data = await getSchools();
      setSchools(data);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
    }
  };

  // On map move or zoom, sets the zoom level in app store.
  const map = useMapEvents({
    moveend: () => {
      setZoom(map.getZoom());
    },
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  // Return polygon/marker components based on the selected dataset

  if (selectedDataset) {
    if (selectedDataset == "schools") {
      fetchSchools();
      return <SchoolMarkers schools={schools} />;
    }
    return <Polygons />;
  }
};

export default MapOrchestrator;
