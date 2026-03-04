import { GeoJSON, useMapEvents } from "react-leaflet";
import { getPostcodeBoundaries } from "@/app/lib/postcodes";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Feature, FeatureCollection } from "geojson";
import { Layer } from "leaflet";

const MIN_ZOOM = 13; // Only show postcodes when zoomed in enough

const PostcodePolygons = () => {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const fetchBoundaries = useRef(
    debounce((bounds, currentZoom) => {
      console.log("fetchBoundaries called");
      console.log("zoom:", currentZoom);
      console.log("bounds:", {
        min_lat: bounds.getSouth(),
        max_lat: bounds.getNorth(),
        min_lng: bounds.getWest(),
        max_lng: bounds.getEast(),
      });
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

  const onEachFeature = (feature: Feature, layer: Layer) => {
    if (feature.properties?.postcode) {
      layer.bindTooltip(feature.properties.postcode, {
        permanent: false, // only show on hover
        direction: "center",
        className: "postcode-tooltip",
      });
    }
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillColor: "#89c4d4",
          fillOpacity: 0.8,
          weight: 0.5,
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          fillColor: "#b9e0ea",
          fillOpacity: 0.2,
          weight: 0.5,
        });
      },
    });
  };

  if (!boundaries) return null;

  return (
    <>
      <GeoJSON
        key={updateCount}
        data={boundaries}
        style={{
          fillColor: "#b9e0ea",
          fillOpacity: 0.2,
          color: "black",
          weight: 0.5,
        }}
        onEachFeature={onEachFeature}
      />
    </>
  );
};

export { PostcodePolygons };
