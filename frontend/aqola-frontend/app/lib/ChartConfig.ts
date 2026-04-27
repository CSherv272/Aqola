import datasetConfig from "../store/datasetConfig.json";
import chartDefinitions from "../store/chartDefinitions.json";
import { crime_rate_by_type_and_area, crime_rate_by_area } from "./LineChart";
import { ofsted_frequency_by_band, flood_risk_frequency_by_postcode  } from "./BarChart";
import { ChartData } from "./ChartModels";
import { get_school_ofsted_history } from "./LineChart";
import { crime_distribution_by_type_and_area } from "./PieChart";

import { SpiderChartResponse } from "./ChartModels";
import BarChart from "../components/charts/BarChart";

type DatasetKey = keyof typeof datasetConfig;

// Maps the apiCall part of the chart info to the actual API function
// Every chart will need a new line here to get the data needed to populate the chart.

// apiCall (in the json) : (params) => actual_function_in_frontend(params);

const temp = () => {
  console.log("temp spider chart api call");
  const tempSpiderChartResponse: SpiderChartResponse = [
    [//iPhone
      {axis:"Battery Life",value:0.22},
      {axis:"Brand",value:0.28},
      {axis:"Contract Cost",value:0.29},
      {axis:"Design And Quality",value:0.17},
      {axis:"Have Internet Connectivity",value:0.22},
      {axis:"Large Screen",value:0.02},
      {axis:"Price Of Device",value:0.21},
      {axis:"To Be A Smartphone",value:0.50}			
    ],
    [//Samsung
      {axis:"Battery Life",value:0.27},
      {axis:"Brand",value:0.16},
      {axis:"Contract Cost",value:0.35},
      {axis:"Design And Quality",value:0.13},
      {axis:"Have Internet Connectivity",value:0.20},
      {axis:"Large Screen",value:0.13},
      {axis:"Price Of Device",value:0.35},
      {axis:"To Be A Smartphone",value:0.38}
    ],
    [//Nokia Smartphone
      {axis:"Battery Life",value:0.26},
      {axis:"Brand",value:0.10},
      {axis:"Contract Cost",value:0.30},
      {axis:"Design And Quality",value:0.14},
      {axis:"Have Internet Connectivity",value:0.22},
      {axis:"Large Screen",value:0.04},
      {axis:"Price Of Device",value:0.41},
      {axis:"To Be A Smartphone",value:0.30}
      ]
  ]
  
  return Promise.resolve(tempSpiderChartResponse);
}

const apiCallMap: Record<string, (areas: string[]) => Promise<ChartData>> = {
  // Allow this to be selected
  crime_rate_by_type_and_area: (areas) =>
    crime_rate_by_type_and_area("E01023987", ["Anti-social behaviour","Bicycle theft","Burglary","Criminal damage and arson","Other theft","Robbery","Shoplifting","Theft from the person","Violence and sexual offences"]), // areas[0]

  crime_rate_by_area: (areas) => crime_rate_by_area(areas),
  ofsted_frequency_by_band: (areas) => ofsted_frequency_by_band(areas[0]),

  flood_risk_frequency_by_postcode: (areas) => flood_risk_frequency_by_postcode(areas),
  flood_risk_frequency_by_postcode_spider: () => temp(),

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
