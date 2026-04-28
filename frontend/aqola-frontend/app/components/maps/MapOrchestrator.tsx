import { useAppStore } from "@/app/store/AppStore";
import { PostcodePolygons } from "./PostcodePolygons";
import { LsoaPolygons } from "./LsoaPolygons";
import { SchoolMarkers } from "./SchoolMarkers";
import { getSchools } from "../../lib/Api";
import { useState, useEffect, useActionState } from "react";
import { School } from "../../lib/ApiModels";
import { Polygons } from "./Polygons";

const MapOrchestrator = () => {
  const selectedDataset = useAppStore((state) => state.selectedDataset);
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

  useEffect(() => {
    // Call fetchSchools only if the selected dataset is "schools"
    if (selectedDataset === "schools") {
      fetchSchools();
    }
  }, [selectedDataset]);

  // Return polygon/marker components based on the selected dataset
  if (selectedDataset == "schools") {
    return <SchoolMarkers schools={schools} />;
  }

  if (selectedDataset) {
    return <Polygons />;
  }
};

export default MapOrchestrator;
