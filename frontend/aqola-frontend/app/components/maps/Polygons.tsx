import { GeoJSON, useMapEvents } from "react-leaflet";
import { PostcodeGeoJson } from "@/app/lib/PolygonModels";
import { useEffect, useRef, useState } from "react";
import { Feature, FeatureCollection } from "geojson";
import { useActiveAreaLayer, useAppStore } from "@/app/store/AppStore";
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

const Polygons = () => {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const toggleArea = useAppStore((state) => state.toggleArea);
  const setZoom = useAppStore((state) => state.setZoom);
  const selectedAreasRef = useRef<string[]>([]);
  const activeLayer = useActiveAreaLayer();

  useEffect(() => {
    selectedAreasRef.current = selectedAreas;
  }, [selectedAreas]);

  const fetchBoundaries = useRef(
    debounce((bounds, areaType) => {
      if (!areaType) {
        setBoundaries(null);
        return;
      }
      let boundaries;
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
        setBoundaries(null);
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
    moveend: () => {
      const zoom = map.getZoom();
      setZoom(zoom);
      fetchBoundaries(map.getBounds(), activeLayer?.areaType ?? null);
    },
    zoomend: () => {
      const zoom = map.getZoom();
      setZoom(zoom);
      fetchBoundaries(map.getBounds(), activeLayer?.areaType ?? null);
    },
  });

  useEffect(() => {
    fetchBoundaries(map.getBounds(), activeLayer?.areaType ?? null);
  }, [activeLayer?.areaType]);

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
