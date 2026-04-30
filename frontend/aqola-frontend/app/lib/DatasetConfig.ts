import datasetConfig from "../store/datasetConfig.json";

// type describes exactly what needs to be shown at what zoom level.
type AreaLayer = {
  areaType: "lsoa" | "postcode" | "urn";
  minZoom: number;
  maxZoom?: number;
};

type DatasetConfig = {
  graphs: string[];
  areaLayers: AreaLayer[];
};

const DATASET_CONFIG = datasetConfig as Record<string, DatasetConfig>;

// Gets a Area Layer based on zoom and dataset.
const resolveAreaType = (
  datasetKey: string,
  currentZoom: number,
): AreaLayer | null => {
  const config = DATASET_CONFIG[datasetKey];
  if (!config) return null;

  // Start from length to start with the most specific map features first.
  for (let i = config.areaLayers.length - 1; i >= 0; i--) {
    const layer = config.areaLayers[i];

    //Infinity here so that if max zoom isn't given this still works.
    const max = layer.maxZoom ?? Infinity;

    if (currentZoom >= layer.minZoom && currentZoom < max) {
      return layer;
    }
  }
  return null; // This means they've zoomed out too far, or not set zoom properly
};

export { resolveAreaType, type AreaLayer };
