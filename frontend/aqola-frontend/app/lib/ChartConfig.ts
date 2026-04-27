import datasetConfig from "../store/datasetConfig.json";
import chartDefinitions from "../store/chartDefinitions.json";
import { crime_rate_by_type_and_area, crime_rate_by_area } from "./LineChart";
import { ofsted_frequency_by_band, flood_risk_frequency_by_postcode  } from "./BarChart";
import { temp_spider_chart_api_call, flood_risk_frequency_by_postcode_spider } from "./SpiderDiagram";
import { ChartData } from "./ChartModels";
import { get_school_ofsted_history } from "./LineChart";
import { crime_distribution_by_type_and_area } from "./PieChart";

import { SpiderDiagramResponse } from "./ChartModels";
import BarChart from "../components/charts/BarChart";
import { api } from "./Api";

type DatasetKey = keyof typeof datasetConfig;

// Maps the apiCall part of the chart info to the actual API function
// Every chart will need a new line here to get the data needed to populate the chart.

// apiCall (in the json) : (params) => actual_function_in_frontend(params);

const apiCallMap: Record<string, (areas: string[]) => Promise<ChartData>> = {
  // Allow this to be selected
  crime_rate_by_type_and_area: (areas) =>
    crime_rate_by_type_and_area("E01023987", ["Anti-social behaviour","Bicycle theft","Burglary","Criminal damage and arson","Other theft","Robbery","Shoplifting","Theft from the person","Violence and sexual offences"]), // areas[0]

  crime_rate_by_area: (areas) => crime_rate_by_area(areas),
  ofsted_frequency_by_band: (areas) => ofsted_frequency_by_band(areas[0]),

  flood_risk_frequency_by_postcode: (areas) => flood_risk_frequency_by_postcode(areas),
  flood_risk_frequency_by_postcode_spider: (areas) => flood_risk_frequency_by_postcode_spider(areas),

  get_school_ofsted_history: (areas) => get_school_ofsted_history(areas),
};

// Gets available charts from datasetConfig.json
const getAvailableCharts = (dataset: string) => {
  dataset = dataset.toLowerCase();

  const graphIds =
    (datasetConfig as Record<DatasetKey, Record< "graphs", string[]>>)[dataset as DatasetKey] ??
    { graphs: [] };
  return chartDefinitions.filter((g) => graphIds.graphs.includes(g.id)) ?? null;
};


// Runs data fetch for inputted chart id
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
  return await apiFn(selectedAreas);
};

// Retrieve the chart definition given an ID, from the chartDefinition JSON
const getChartDefinition = (chartId: string | undefined) => {
  if (chartId === undefined) return null;
  const chart = chartDefinitions.find((c) => c.id === chartId);
  if (!chart) return null;
  return chart;
};

export { getAvailableCharts, fetchChartData, getChartDefinition };
