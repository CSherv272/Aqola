import type { SpiderDiagramResponse } from "./ChartModels"
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const temp_spider_chart_api_call = async (): Promise<SpiderDiagramResponse> => {
    const tempSpiderChartResponse: SpiderDiagramResponse = 
  {
    chartType: "spider",
    type: "flood_by_postcode",
    area: "postcodes",
    chart: {
      groups: [
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
      ],
      title: "Temp Spider Chart"
    }
  }

  return Promise.resolve(tempSpiderChartResponse);
}

export const flood_risk_frequency_by_postcode_spider = async (
  postcodes: string[],
): 

  Promise<SpiderDiagramResponse> => {
  // When there are no postcodes selected, return an empty object
  if (postcodes.length == 0){
    return (
    {
      chartType: "spider",
      type: "flood_data",
      area: "postcode",
      chart: {
        groups: [[{
          axis: "",
          value: 0
          }]],
          title: "Kent Postcode Flood Risks",
        },
    })
  }

  const response = await api.get(`/flood`, {
    params: {
      postcodes: postcodes,
    },
    paramsSerializer: (params) => {
      return params.postcodes.map((p: string) => `postcodes=${p}`).join("&");
    },
  });

  const groups = response.data.map((group: any) => {
    const keys = Object.keys(group).filter((k) => k !== "postcode" && k !== "frs_band");
    const vals = keys.map((k) => ({
      axis: k,
      value: group[k],
    }));

    return vals;
  });

  const spider_return: SpiderDiagramResponse = {
    chartType: "spider",
    type: "flood_data",
    area: "postcode",
    chart: {
      groups,
      title: "Kent Postcode Flood Risks",
    },
  };
  return spider_return;
};