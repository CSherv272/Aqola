import datasetConfig from "../store/datasetConfig.json";
import chartDefinitions from "../store/chartDefinitions.json";
import { crime_rate_by_type_and_area, crime_rate_by_area } from "./line_graph";
import {
  ofsted_frequency_by_band,
  flood_risk_frequency_by_postcode,
} from "./bar_graph";
import { chartData } from "./types";
import { get_school_ofsted_history } from "./line_graph";
import { api } from "./api";

type DatasetKey = keyof typeof datasetConfig;

// Maps the apiCall part of the chart info to the actual API function
// Every chart will need a new line here to get the data needed to populate the chart.

// apiCall (in the json) : (params) => actual_function_in_frontend(params);

const apiCallMap: Record<string, (areas: string[]) => Promise<chartData>> = {
  // Allow this to be selected
  crime_rate_by_type_and_area: (areas) =>
    crime_rate_by_type_and_area("E01023987", ["Anti-social behaviour","Bicycle theft","Burglary","Criminal damage and arson","Other theft","Robbery","Shoplifting","Theft from the person","Violence and sexual offences"]), // areas[0]

  crime_rate_by_area: (areas) => crime_rate_by_area(areas),
  ofsted_frequency_by_band: (areas) => ofsted_frequency_by_band(areas[0]),

  //NOTE Only this one works for now!
  flood_risk_frequency_by_postcode: (areas) =>
    flood_risk_frequency_by_postcode(areas),

  get_school_ofsted_history: (areas) => get_school_ofsted_history(areas),
};

// Gets available charts from datasetConfig.json
const getAvailableCharts = (dataset: string) => {
  dataset = dataset.toLowerCase();

  const graphIds =
    (datasetConfig as Record<DatasetKey, Record< "graphs", string[]>>)[dataset as DatasetKey] ??
    { graphs: [] };
    // console.log("available graph ids for dataset", dataset, ":", graphIds);
  return chartDefinitions.filter((g) => graphIds.graphs.includes(g.id)) ?? null;
};


// returns data for the specfic chart entered.
const fetchChartData = async (chartId: string | undefined, selectedAreas: string[] | undefined) => {
  if (chartId === undefined || selectedAreas === undefined){
    return null
  }
  
  //Find relevant chart
  const chart = chartDefinitions.find((c) => c.id === chartId);
  if (!chart) throw new Error(`Unkown Chart id: ${chartId}`);

  //Find relevant function
  const apiFn = apiCallMap[chart.apiCall];
  if (!apiFn) throw new Error(`No API function mapped for: ${chart.apiCall}`);

  //Run function
  const val = await apiFn(selectedAreas)
  return await apiFn(selectedAreas);
};

const getChartDefinition = (chartId: string | undefined) => {
  if (chartId === undefined) return null;
  const chart = chartDefinitions.find((c) => c.id === chartId);
  if (!chart) return null;
  return chart;
};

export { getAvailableCharts, fetchChartData, getChartDefinition };
