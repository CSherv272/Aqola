import { GeoJSON, useMapEvents } from "react-leaflet";
import { PostcodeGeoJson } from "@/app/lib/PolygonModels";
import { useEffect, useRef, useState } from "react";
import { Feature, FeatureCollection } from "geojson";
import { useAppStore } from "@/app/store/AppStore";
import { getDatasetAreaType } from "@/app/lib/ChartConfig";
import { debounce, min } from "lodash";
import { getPostcodeBoundaries } from "@/app/lib/Postcode";
import { getLsoaBoundaries } from "@/app/lib/Lsoa";
import { DomEvent, Layer } from "leaflet";

interface PolygonProps {
  postcode_name: string;
  color: string;
  postcode_boundary_data: PostcodeGeoJson;
  isSelected?: boolean;
}

interface PolygonsProps {
  dataset: "crime" | "flood";
}

const Polygon = ({
  postcode_name,
  color,
  postcode_boundary_data,
  isSelected,
}: PolygonProps) => {
  return (
    <GeoJSON
      key={`${postcode_name}-${isSelected}`} // forces re-render when style changes
      data={postcode_boundary_data}
      style={{
        fillColor: isSelected ? "#66b6bd" : color,
        fillOpacity: isSelected ? 0.4 : 0.1,
        color: "#66b6bd",
        weight: isSelected ? 2 : 0.5,
      }}
    />
  );
};

const Polygons = ({ dataset }: PolygonsProps) => {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const toggleArea = useAppStore((state) => state.toggleArea);
  const selectedAreasRef = useRef<string[]>([]);

  useEffect(() => {
    selectedAreasRef.current = selectedAreas;
  }, [selectedAreas]);

  const areaType = getDatasetAreaType(dataset);

  const MIN_POSTCODE_ZOOM = 13; // Only show postcodes when zoomed in enough
  const MIN_LSOA_ZOOM = 8; // Only show LSOAs when zoomed in enough
  const MIN_ZOOM = areaType === "postcode" ? MIN_POSTCODE_ZOOM : MIN_LSOA_ZOOM;

  const fetchBoundaries = useRef(
    debounce((bounds, currentZoom, areaType, minZoom) => {
      console.log("current zoom: " + currentZoom);
      if (currentZoom < minZoom) {
        console.log(
          "zoomed out too far current zoom: " +
            currentZoom +
            ", min zoom: " +
            minZoom +
            ", clearing boundaries",
        );
        // Handle zoom level
        setBoundaries(null);
        return;
      }
      let boundaries = null;
      // Fetch boundaries based on area type
      if (areaType === "postcode") {
        boundaries = getPostcodeBoundaries({
          min_lat: bounds.getSouth(),
          max_lat: bounds.getNorth(),
          min_lng: bounds.getWest(),
          max_lng: bounds.getEast(),
        });
      } else if (areaType === "lsoa") {
        boundaries = getLsoaBoundaries({
          min_lat: bounds.getSouth(),
          max_lat: bounds.getNorth(),
          min_lng: bounds.getWest(),
          max_lng: bounds.getEast(),
        });
      }
      if (!boundaries) {
        console.error("Unsupported area type: " + areaType);
        return;
      }
      boundaries.then((data) => {
        setBoundaries({
          type: "FeatureCollection",
          features: data,
        });
        setUpdateCount((c) => c + 1);
      });
    }, 300),
  ).current;

  const map = useMapEvents({
    moveend: () =>
      fetchBoundaries(map.getBounds(), map.getZoom(), areaType, MIN_ZOOM),
    zoomend: () =>
      fetchBoundaries(map.getBounds(), map.getZoom(), areaType, MIN_ZOOM),
  });

  useEffect(() => {
    fetchBoundaries(map.getBounds(), map.getZoom(), areaType, MIN_ZOOM);
  }, [areaType]);

  const getStyle = (areaName: string) => {
    const isSelected = selectedAreas.includes(areaName);
    return {
      fillColor: isSelected ? "#000000" : "#b9e0ea",
      fillOpacity: isSelected ? 0.8 : 0.2,
      weight: 0.5,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const areaName =
      feature.properties?.postcode || feature.properties?.lsoa || "Unknown";

    if (areaName) {
      layer.bindTooltip(areaName, {
        permanent: false, // only show on hover
        direction: "center",
        className: "postcode-tooltip",
      });
    }
    layer.on({
      mouseover: (e) => {
        if (selectedAreasRef.current.includes(areaName)) return;
        e.target.setStyle({
          fillColor: "#89c4d4",
          fillOpacity: 0.8,
          weight: 0.5,
        });
      },
      mouseout: (e) => {
        if (selectedAreasRef.current.includes(areaName)) return;
        e.target.setStyle({
          fillColor: "#b9e0ea",
          fillOpacity: 0.2,
          weight: 0.5,
        });
      },
      click: (e) => {
        DomEvent.stopPropagation(e);
        const isSelected = selectedAreasRef.current.includes(areaName);
        toggleArea(areaName);
        e.target.setStyle(
          isSelected
            ? { fillColor: "#b9e0ea", fillOpacity: 0.2, weight: 0.5 }
            : { fillColor: "#000000", fillOpacity: 0.8, weight: 0.5 },
        );
      },
    });
  };

  if (!boundaries) {
    return null;
  }

  return (
    <GeoJSON
      key={updateCount} // forces re-render when boundaries change
      data={boundaries}
      style={(feature) => {
        if (feature) {
          const areaName =
            feature.properties?.postcode ||
            feature.properties?.lsoa ||
            "Unknown";
          return getStyle(areaName);
        } else {
          return {};
        }
      }}
      onEachFeature={onEachFeature}
    />
  );
};

export { Polygon, Polygons };
