import { GeoJSON, useMapEvents } from "react-leaflet";
import { getLsoaBoundaries } from "@/app/lib/Lsoa";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Feature, FeatureCollection } from "geojson";
import { Layer, DomEvent } from "leaflet";
import { useAppStore } from "@/app/store/AppStore";

const MIN_ZOOM = 8; // Only show lsoas when zoomed in enough

const LsoaPolygons = () => {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const selectedAreas = useAppStore((state) => state.selectedAreas);
  const toggleArea = useAppStore((state) => state.toggleArea);
  const selectedAreasRef = useRef<string[]>([]);

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
      getLsoaBoundaries({
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

  const getStyle = (lsoa: string) => {
    const isSelected = selectedAreas.includes(lsoa);
    return {
      fillColor: isSelected ? "#000000" : "#b9e0ea",
      fillOpacity: isSelected ? 0.8 : 0.2,
      weight: 0.5,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const lsoa = feature.properties?.lsoa;

    if (lsoa) {
      layer.bindTooltip(lsoa, {
        permanent: false, // only show on hover
        direction: "center",
        className: "lsoa-tooltip",
      });
    }
    layer.on({
      mouseover: (e) => {
        if (selectedAreasRef.current.includes(lsoa)) return;
        e.target.setStyle({
          fillColor: "#89c4d4",
          fillOpacity: 0.8,
          weight: 0.5,
        });
      },
      mouseout: (e) => {
        if (selectedAreasRef.current.includes(lsoa)) return;
        e.target.setStyle({
          fillColor: "#b9e0ea",
          fillOpacity: 0.2,
          weight: 0.5,
        });
      },
      click: (e) => {
        DomEvent.stopPropagation(e);
        const isSelected = selectedAreasRef.current.includes(lsoa);
        toggleArea(lsoa);
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
          feature?.properties?.lsoa ? getStyle(feature.properties.lsoa) : {}
        }
        onEachFeature={onEachFeature}
      />
    </>
  );
};

export { LsoaPolygons };
