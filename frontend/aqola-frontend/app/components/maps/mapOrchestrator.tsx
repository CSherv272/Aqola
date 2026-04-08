import { useAppStore } from "@/app/store/appStore";
// import datasetCofig from "../../store/datasetConfig";
import { PostcodePolygons } from "./postcode_polygons";
import { SchoolMarkers } from "./school_markers";
import { getSchools } from "../../lib/api";
import { useState, useEffect } from "react";
import { School } from "../../lib/api_models";

const MapOrchestrator = () => {
    const selectedDataset = useAppStore((state) => state.selectedDataset);
    const [schools, setSchools] = useState<School[]>([]);

    // Fetch schools data when the component mounts
    const fetchSchools = async () => {
        try {
            const data = await getSchools();
            setSchools(data);
            // console.log("Manager: Schools data received!");
        } catch (err) {
            console.error("Failed to fetch schools:", err);
        }
    };

    useEffect(() => {
        // Call fetchSchools only if the selected dataset is "Schools"
        if (selectedDataset === "schools") {
            fetchSchools();
        }

    }, [selectedDataset]);

    switch(selectedDataset) {
        case "schools":
            console.log("Schools dataset selected - fetching and displaying school markers.");
            return <SchoolMarkers schools={schools} />;
        case "crime":
            console.log("Crime dataset selected - but no map layer implemented yet!");
            return null; // needs to be lsoa polygons
        case "flood":
            return <PostcodePolygons />;
        default:
            return null;
    }
}

export default MapOrchestrator;