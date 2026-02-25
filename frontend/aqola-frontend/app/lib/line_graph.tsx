import { stringify } from "querystring";
import type { Crime, CrimeTypes, UniqueMonths } from "./api_models"
import type { LineChartResponse } from "./frontend_models"
import axios from "axios";

// method naming convention <area>_<xlabel>_<ylabel>_<lines>


export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const postcode_time_frequency_crimetypes = async (lsoa: string): Promise<LineChartResponse> => {
  const apiResponse = await api.get(`/lsoas/${lsoa}/crime/timeseries`);
  const crimeCountData = apiResponse.data;

  let lines: { line_name: string; coords: [Date, number][] }[] = [];

  for (const [crimeType, coords] of Object.entries(crimeCountData)) {
    lines.push({
      line_name: crimeType,
      coords: (coords as [Date, number][]).map(([date, count]) => [new Date(date), count])
    });
  }

  const response: LineChartResponse = {
    chartType: "line",
    type: "crime_data",
    area: "postcode",
    chart: {
      lines,
      title: "Crime by Crime Type",
      xlabel: "Months",
      ylabel: "Frequency",
    },
  };

  return response;
};