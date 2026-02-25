import type { Crime, CrimeTypes, UniqueMonths } from "./api_models"
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
  let lines: { line_name: string; coords: [Date, number][] }[] = [];

  for (const crime of uniqueCrimeTypes.data.values) {
    const coords: [Date, number][] = [];
    // for each unique month
    for (let monthIdx = 0; monthIdx < months.length; monthIdx++) {
      const month = months[monthIdx];
      // get the crimes for that crime type and that month
      const apiResponse = await api.get<Crime[]>(`/lsoas/${lsoa}/crime?crimeType=${crime}&month=${month}`);
      // take either the dataset returned, or if empty, an empty array
      const crimes = Array.isArray(apiResponse.data) ? apiResponse.data : [];
      const date = crimes[0]?.date ? new Date(crimes[0].date) : new Date(month);
      coords.push([date, crimes.length]);
    }
    // for each crime type, add the array of co-ordinates
    lines.push({ line_name: crime, coords });
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