import { stringify } from "querystring";
import type { Crime, CrimeTypes, UniqueMonths } from "./api_models"
import type { LineChartResponse } from "./frontend_models"
import axios from "axios";

// method naming convention <area>_<xlabel>_<ylabel>_<lines>


export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Gets crime rate for:
//      specific lsoa (string) - required
//      crime type (list of strings) - optional
export const crime_rate_by_type_and_area = async (lsoa: string, crimeTypes? : string[]): Promise<LineChartResponse> => {
  let crimeTypeSlug: string = "";

  let colours: Record<string, string> = {
    "Anti-social behaviour": "brown",
    "Bicycle theft": "white",
    "Burglary": "blue",
    "Criminal damage and arson": "pink",
    "Drugs": "cyan",
    "Other crime": "purple",
    "Other theft": "grey",
    "Possession of weapons": "lime",
    "Public order": "orange",
    "Robbery": "red",
    "Shoplifting": "yellow",
    "Theft from the person": "maroon",
    "Vehicle crime": "green",
    "Violence and sexual offences": "teal",
  };
  
  if (crimeTypes){
    crimeTypeSlug = "?"
    for (let type of crimeTypes){
      crimeTypeSlug += `crimeType=${type}&`
    }
    crimeTypeSlug = crimeTypeSlug.substring(0, crimeTypeSlug.length-1)
  }
  
  const apiResponse = await api.get(`/lsoas/${lsoa}/crime/timeseries/${crimeTypeSlug}`);
  const crimeCountData = apiResponse.data;

  let lines: { line_name: string; coords: [Date, number][]; color: string }[] = [];

  for (const [crimeType, coords] of Object.entries(crimeCountData)) {
    lines.push({
      line_name: crimeType,
      coords: (coords as [Date, number][]).map(([date, count]) => [new Date(date), count]),
      color: colours[crimeType]
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