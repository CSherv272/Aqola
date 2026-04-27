import { api } from "./LineChart";
import type { PieChartResponse } from "./ChartModels";

const colours: Record<string, string> = {
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

// Gets crime breakdown by type per LSOA
// Each group is an LSOA, each section is a crime type
export const crime_distribution_by_type_and_area = async (
  lsoas: string[]
): Promise<PieChartResponse> => {
  const lsoaSlug = "?" + lsoas.map((l) => `lsoas=${l}`).join("&");
  const apiResponse = await api.get(`/crime/crime-rate-by-type/${lsoaSlug}`);
  const data: Record<string, [string, number][]> = apiResponse.data;

  const groups = Object.entries(data).map(([lsoa, typeCounts]) => ({
    name: lsoa,
    sections: typeCounts.map(([crime_type, count]) => ({
      section_name: crime_type,
      value: String(count),
      color: colours[crime_type] ?? "black",
    })) as PieChartResponse["chart"]["groups"][number]["sections"],
  }));

  return {
    chart_type: "pie",
    type: "crime_data",
    area: "lsoa",
    chart: {
      groups,
      title: lsoas.length === 1
        ? `Crime Distribution: ${lsoas[0]}`
        : "Crime Distribution by Area",
    },
  };
};