import axios from "axios";
import type {School, SchoolCounts} from "./api_models";
import type {BarChartResponse} from "./frontend_models";

// method naming convention <area>_<xlabel>_<ylabel>_<bars>

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const get_bar_info = async () => {
  const response = await api.get("/lsoas/E01024135/school");
  return response.data;
};

// Given an area (postcode, lsoa, or none) find the number of schools in each ofsted band 
export const ofsted_frequency_by_band = async (area? : string): Promise<BarChartResponse> => {
  let apiResponse

  if (area && area.length > 7){
    apiResponse = await api.get<SchoolCounts>(`/lsoas/${area}/school/ofstedcount`)
  }
  else if (area){
    apiResponse = await api.get<SchoolCounts>(`/postcodes/${area}/school/ofstedcount`)
  }
  else{
    apiResponse = await api.get<SchoolCounts>("/school/ofstedcount")
  }
  
  const scores = apiResponse.data

const rankingCounts = Object.fromEntries(
  scores.ofsted_rankings.map(school => [school.ranking, school.count])
);

let response: BarChartResponse = {
  chartType: "bar",
  type: "school_data",
  area: "county",

  chart: {
    groups: [
      {
        name: "Kent School Performance",
        bars: [
          {
            bar_name: "Outstanding",
            value: rankingCounts[1] ?? 0,
            color: "green"
          },
          {
            bar_name: "Good",
            value: rankingCounts[2] ?? 0,
            color: "cyan"
          },
          {
            bar_name: "Needs Improvement",
            value: rankingCounts[3] ?? 0,
            color: "blue"
          },
          {
            bar_name: "Inadequate",
            value: rankingCounts[4] ?? 0,
            color: "brown"
          },
          {
            bar_name: "Ungraded",
            value: (rankingCounts[0] ?? 0) + (rankingCounts[-1] ?? 0),
            color: "grey"
          }
        ]
      }
    ],
    title: "Kent Ofsted Performance",
    xlabel: "Ofsted Rating",
    ylabel: "Frequency"
  }
}

return response;
}