import { stringify } from "querystring";
import type { Crime, CrimeTypes, UniqueMonths } from "./ApiModels"
import type { LineChartResponse } from "./ChartModels"
import axios from "axios";
import type { School } from "./ApiModels"

// method naming convention <area>_<xlabel>_<ylabel>_<lines>


export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Gets crime rate for:
//      specific lsoa (string) - required
//      crime type (list of strings) - optional
// returns a graph of crime rate over time in an lsoa
// Each line represents a crime type
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
  
  const apiResponse = await api.get(`/crime/timeseries/${crimeTypeSlug}&lsoas=${lsoa}`);
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

// Gets total crime rate over multiple lsoas
// Returns a graph of total crime rate over time
// Each line is an lsoa
export const crime_rate_by_area = async (lsoas : string[]) : Promise<LineChartResponse> => {

  const colours = ["brown", "white", "blue", "pink", "cyan", "purple", "grey", "lime", "orange", "red", "yellow", "maroon", "green", "teal"]
  let lsoaSlug : string = "";

    if (lsoas){
    lsoaSlug = "?"
    for (let lsoa of lsoas){
      lsoaSlug += `lsoas=${lsoa}&`
    }
    lsoaSlug = lsoaSlug.substring(0, lsoaSlug.length-1)
  }

  const apiResponse = await api.get(`/crime/crime-rate-total/${lsoaSlug}`);
  const crimeCountData = apiResponse.data;

  let lines: { line_name: string; coords: [Date, number][]; color: string }[] = [];

for (const [index, [lsoa, coords]] of Object.entries(crimeCountData).entries()) {
  console.log("Color" + colours[index % colours.length])  
  lines.push({
      line_name: lsoa,
      coords: (coords as [Date, number][]).map(([date, count]) => [new Date(date), count]),
      color: colours[index % colours.length]
    });
  }

  const response: LineChartResponse = {
    chartType: "line",
    type: "crime_data",
    area: "postcode",
    chart: {
      lines,
      title: "Crime Rate by Area",
      xlabel: "Months",
      ylabel: "Frequency",
    },
  };

  return response;
}

export const get_school_ofsted_history = async (urn: string[]): Promise<LineChartResponse> => {
  // regex filter to remove anything that isn't exactly a 6-digit number (URN)
  const validUrns = urn ? urn.filter(id => /^\d{6}$/.test(String(id))) : [];

  if (validUrns.length === 0) {
    return {
      chartType: "line",
      type: "school_data",
      area: "school",
      chart: {
        lines: [],
        title: "Please select a school on the map",
        xlabel: "Year",
        ylabel: "Ofsted Ranking",
      },
    };
  }

  const colours = ["#dc2626", "#2563eb", "#16a34a", "#d97706", "#9333ea", "#0891b2", "#db2777"];

  const urnSlug = "?" + validUrns.map(u => `urns=${u}`).join("&");
  const apiResponse = await api.get(`/school/${urnSlug}`);

  console.log("unr: " + urn)

  const schoolRecords: School[] = apiResponse.data;

  // Group records by URN (falling back to school_name if urn isn't on the model)
  const recordsByUrn = schoolRecords.reduce<Record<string, School[]>>((acc, record) => {
    const key = (record as any).urn ?? record.school_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {});

  const lines = Object.values(recordsByUrn).map((records, i) => {
    const coords: [Date, number][] = records
      .filter(s => s.ofsted_ranking > 0 && s.ofsted_ranking <= 4)
      .map(s => {
        const startYear = s.year_range.split("-")[0];
        return [new Date(`${startYear}-01-01`), s.ofsted_ranking] as [Date, number];
      })
      .sort((a, b) => a[0].getTime() - b[0].getTime());

    return {
      line_name: records[0]?.school_name || "Unknown School",
      coords,
      color: colours[i % colours.length],
    };
  });

  const title =
    lines.length === 1
      ? `Ofsted Rating History: ${lines[0].line_name}`
      : "Ofsted Rating History: School Comparison";

  return {
    chartType: "line",
    type: "school_data",
    area: "school",
    chart: {
      lines,
      title,
      xlabel: "Year",
      ylabel: "Ofsted Ranking",
    },
  };
};