import axios from "axios";
import type {School} from "./api_models";
import type {BarChartResponse} from "./frontend_models";

// method naming convention <area>_<xlabel>_<ylabel>_<bars>

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const get_bar_info = async () => {
  const response = await api.get("/lsoas/E01024135/school");
  return response.data;
};

export const county_ofsted_frequency = async (): Promise<BarChartResponse> => {
  const apiResponse = await api.get<School[]>("/school")
  let excellent = 0
  let good = 0
  let ok = 0
  let bad = 0
  let ungraded = 0

  apiResponse.data.forEach((school) => {
    switch(school.ofsted_ranking){
      case -1:
        ungraded++
        break;
      case 4:
        bad++
        break;
      case 3:
        ok++
        break;
      case 2:
        good++
        break;
      case 1:
        excellent++
        break;
    }
  });

  let response: BarChartResponse = {
    "chartType": "bar",
    "type": "school_data",
    "area": "county",
    chart:{
      "groups":[
        {
          "name": "Kent School Performance",
          "bars": [
            {
              "bar_name": "excellent",
              "value": excellent,
              "color": "red"
            },
            {
              "bar_name": "good",
              "value": good,
              "color": "blue"
            },
            {
              "bar_name": "Needs Improvement",
              "value": ok,
              "color": "green"
            },
            {
              "bar_name": "Inadequate",
              "value": bad,
              "color": "teal"
            },
            {
              "bar_name": "Ungraded",
              "value": ungraded,
              "color": "cyan"
            }]
        }],
      title: "Kent Ofsted Performance",
      xlabel: "Ofsted Rating",
      ylabel: "Frequency",
    }
  }

  return response;
}