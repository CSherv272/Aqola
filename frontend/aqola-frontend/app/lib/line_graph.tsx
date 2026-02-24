import type {Crime, CrimeTypes, UniqueMonths} from "./api_models"
import type { LineChartResponse } from "./frontend_models"
import axios from "axios";

// method naming convention <area>_<xlabel>_<ylabel>_<lines>


export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const postcode_time_frequency_crimetypes = async (lsoa: string): Promise<LineChartResponse> => {
  
  const uniqueCrimeTypes = await api.get<CrimeTypes>(`/crime/types`);
  const uniqueMonths = await api.get<UniqueMonths>(`/crime/months`);

  const months = uniqueMonths.data.values ?? [];
  const lines: { line_name: string; coords: [number, number][] }[] = [];

  for (const crime of uniqueCrimeTypes.data.values) {
    const coords: [number, number][] = [];

    for (let monthIdx = 0; monthIdx < months.length; monthIdx++) {
      const month = months[monthIdx];
      // Fetch crimes for this crime type and month
      const apiResponse = await api.get<Crime[]>(`/lsoas/${lsoa}/crime?crimeType=${crime}&month=${month}`);
      const crimes = Array.isArray(apiResponse.data) ? apiResponse.data : [];
      coords.push([monthIdx, crimes.length]);
    }

    lines.push({ line_name: crime, coords });
  }

  const response: LineChartResponse = {
    chartType: "line",
    type: "crime_data",
    area: "postcode",
    chart: {
      lines,
      title: "Crime by Postcode",
      xlabel: "Months",
      ylabel: "Frequency",
    },
  };

  return response;
};