import { GeoJSON, useMapEvents } from "react-leaflet";
import { getPostcodeBoundaries } from "@/app/lib/Postcode";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Feature, FeatureCollection } from "geojson";
import { Layer, DomEvent } from "leaflet";
import { useAppStore } from "@/app/store/AppStore";

const MIN_ZOOM = 13; // Only show postcodes when zoomed in enough

const PostcodePolygons = () => {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const toggleArea = useAppStore((state) => state.toggleArea);
  const selectedAreasRef = useRef<string[]>([]);
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const isSchoolsDataset = selectedDataset.toLowerCase() === "schools";

  // Keep ref in sync with store
  useEffect(() => {
    selectedAreasRef.current = selectedAreas;
  }, [selectedAreas]);

  const fetchBoundaries = useRef(
    debounce((bounds, currentZoom) => {
      if (currentZoom < MIN_ZOOM) {
        setBoundaries(null);
        return;
      }
      getPostcodeBoundaries({
        min_lat: bounds.getSouth(),
        max_lat: bounds.getNorth(),
        min_lng: bounds.getWest(),
        max_lng: bounds.getEast(),
      }).then((data) => {
        setBoundaries({
          type: "FeatureCollection",
          features: data,
        });
        setUpdateCount((c) => c + 1);
      });
    }, 300),
  ).current;

  const map = useMapEvents({
    moveend: () => fetchBoundaries(map.getBounds(), map.getZoom()),
    zoomend: () => fetchBoundaries(map.getBounds(), map.getZoom()),
  });

  useEffect(() => {
    fetchBoundaries(map.getBounds(), map.getZoom());
  }, []);

  const getStyle = (postcode: string) => {
    const isSelected = selectedAreas.includes(postcode);
    return {
      fillColor: isSelected ? "#000000" : "#b9e0ea",
      fillOpacity: isSelected ? 0.8 : 0.2,
      weight: 0.5,
      interactive: !isSchoolsDataset,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    if (isSchoolsDataset) return;
    
    const postcode = feature.properties?.postcode;

    if (postcode) {
      layer.bindTooltip(postcode, {
        permanent: false, // only show on hover
        direction: "center",
        className: "postcode-tooltip",
      });
    }
    layer.on({
      mouseover: (e) => {
        if (selectedAreasRef.current.includes(postcode)) return;
        e.target.setStyle({
          fillColor: "#89c4d4",
          fillOpacity: 0.8,
          weight: 0.5,
        });
      },
      mouseout: (e) => {
        if (selectedAreasRef.current.includes(postcode)) return;
        e.target.setStyle({
          fillColor: "#b9e0ea",
          fillOpacity: 0.2,
          weight: 0.5,
        });
      },
      click: (e) => {
        DomEvent.stopPropagation(e);
        const isSelected = selectedAreasRef.current.includes(postcode);
        toggleArea(postcode);
        e.target.setStyle(
          isSelected
            ? { fillColor: "#b9e0ea", fillOpacity: 0.2, weight: 0.5 }
            : { fillColor: "#000000", fillOpacity: 0.8, weight: 0.5 },
        );
      },
    });
  };

  if (!boundaries) return null;

  return (
    <>
      <GeoJSON
        key={updateCount}
        data={boundaries}
        style={(feature) =>
          feature?.properties?.postcode
            ? getStyle(feature.properties.postcode)
            : {}
        }
        onEachFeature={onEachFeature}
      />
    </>
  );
};

export { PostcodePolygons };
