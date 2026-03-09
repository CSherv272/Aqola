import datasetConfig from "../store/datasetConfig.json";
import chartDefinitions from "../store/chartDefinitions.json";
import { crime_rate_by_type_and_area, crime_rate_by_area } from "./line_graph";
import {
  ofsted_frequency_by_band,
  flood_risk_frequency_by_postcode,
} from "./bar_graph";

type DatasetKey = keyof typeof datasetConfig;

const apiCallMap: Record<string, (areas: string[]) => Promise<any>> = {
  crime_rate_by_type_and_area: (areas) =>
    crime_rate_by_type_and_area(areas[0], ["Other theft", "Drugs"]),
  crime_rate_by_area: (areas) => crime_rate_by_area(areas),
  ofsted_frequency_by_band: (areas) => ofsted_frequency_by_band(areas[0]),
  flood_risk_frequency_by_postcode: (areas) =>
    flood_risk_frequency_by_postcode(areas),
};

const getAvailableCharts = (dataset: string) => {
  dataset = dataset.toLowerCase();
  console.log("Checking this dataset graphs! -> " + dataset);

  const graphIds =
    (datasetConfig as Record<DatasetKey, string[]>)[dataset as DatasetKey] ??
    [];
  return chartDefinitions.filter((g) => graphIds.includes(g.id));
};

const fetchChartData = async (chartId: string, selectedAreas: string[]) => {
  const chart = chartDefinitions.find((c) => c.id === chartId);
  if (!chart) throw new Error(`Unkown Chart id: ${chartId}`);

  const apiFn = apiCallMap[chart.apiCall];
  if (!apiFn) throw new Error(`No API function mapped for: ${chart.apiCall}`);

  return await apiFn(selectedAreas);
};

const getChartDefinition = (chartId: string) => {
  const chart = chartDefinitions.find((c) => c.id === chartId);
  if (!chart) return null;
  return chart;
};

export { getAvailableCharts, fetchChartData, getChartDefinition };
