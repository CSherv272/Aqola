import { useAppStore } from "@/app/store/appStore";
import datasetCofig from "../../store/datasetConfig.json";
import { PostcodePolygons } from "../../components/maps/postcode_polygons";
import { SchoolMarkers } from "../../components/maps/school_markers";
import { getSchools } from "../api";
import { useState, useEffect } from "react";
import { School } from "../api_models";

const MapOrchestrator = () => {
    const selectedDataset = useAppStore((state) => state.selectedDataset);
    const [schools, setSchools] = useState<School[]>([]);

    // Fetch schools data when the component mounts
    useEffect(() => {
        const fetchSchools = async () => {
        try {
            const data = await getSchools();
            setSchools(data);
            // console.log("Manager: Schools data received!");
        } catch (err) {
            console.error("Failed to fetch schools:", err);
        }
        };

        // Call fetchSchools only if the selected dataset is "Schools"
        if (selectedDataset === "Schools") {
            fetchSchools();
        }

    }, [selectedDataset]);

    switch(selectedDataset) {
        case "Schools":
            return <SchoolMarkers schools={schools} />;
        case "crime":
            return null; // needs to be lsoa polygons
        case "flood":
            return <PostcodePolygons />;
        default:
            return null;
    }
}

export default MapOrchestrator;