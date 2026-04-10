import axios from "axios";
import type { School, SchoolCounts } from "./ApiModels";
import type { BarChartResponse } from "./ChartModels";

// method naming convention <area>_<xlabel>_<ylabel>_<bars>

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const get_bar_info = async () => {
  const response = await api.get("/school/?lsoas=E01024135");
  return response.data;
};

// Given an area (postcode, lsoa, or none) find the number of schools in each ofsted band
export const ofsted_frequency_by_band = async (
  area?: string,
): Promise<BarChartResponse> => {
  let apiResponse;

  if (area && area.length > 7) {
    apiResponse = await api.get<SchoolCounts>(
      `/school/ofsted-count/?lsoas=${area}`,
    );
  } else if (area) {
    apiResponse = await api.get<SchoolCounts>(
      `/school/ofsted-count/?postcodes=${area}`,
    );
  } else {
    apiResponse = await api.get<SchoolCounts>("/school/ofsted-count");
  }

  const scores = apiResponse.data;

  const rankingCounts = Object.fromEntries(
    scores.ofsted_rankings.map((school) => [school.ranking, school.count]),
  );

  const response: BarChartResponse = {
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
              color: "green",
            },
            {
              bar_name: "Good",
              value: rankingCounts[2] ?? 0,
              color: "cyan",
            },
            {
              bar_name: "Needs Improvement",
              value: rankingCounts[3] ?? 0,
              color: "blue",
            },
            {
              bar_name: "Inadequate",
              value: rankingCounts[4] ?? 0,
              color: "brown",
            },
            {
              bar_name: "Ungraded",
              value: (rankingCounts[0] ?? 0) + (rankingCounts[-1] ?? 0),
              color: "grey",
            },
          ],
        },
      ],
      title: "Kent Ofsted Performance",
      xlabel: "Ofsted Rating",
      ylabel: "Frequency",
    },
  };

  return response;
};

// Given an area, find the number of schools in each ofsted band, broken down by year
export const ofsted_frequency_yearly = async (
  area?: string,
): Promise<BarChartResponse> => {
  let apiResponse;

  if (area && area.length > 7) {
    apiResponse = await api.get(`/school/ofsted-count-yearly/?lsoas=${area}`);
  } else if (area) {
    apiResponse = await api.get(`/school/ofsted-count-yearly/?postcodes=${area}`);
  } else {
    apiResponse = await api.get("/school/ofsted-count-yearly");
  }

  const rawData = apiResponse.data.yearly_rankings;

  const uniqueYears = Array.from(new Set(rawData.map((d: any) => d.year_range))).sort();

  const groups = uniqueYears.map((year: any) => {
    
    const yearData = rawData.filter((d: any) => d.year_range === year);

    const rankingCounts = Object.fromEntries(
      yearData.map((row: any) => [row.ranking, row.count])
    );

    return {
      name: year as string, // This becomes the label on the X-axis (e.g., "2012-2013")
      bars: [
        { bar_name: "Outstanding", value: rankingCounts[1] ?? 0, color: "green" },
        { bar_name: "Good", value: rankingCounts[2] ?? 0, color: "cyan" },
        { bar_name: "Needs Improvement", value: rankingCounts[3] ?? 0, color: "blue" },
        { bar_name: "Inadequate", value: rankingCounts[4] ?? 0, color: "brown" },
        { bar_name: "Ungraded", value: (rankingCounts[0] ?? 0) + (rankingCounts[-1] ?? 0), color: "grey" },
      ],
    };
  });

  const response: BarChartResponse = {
    chartType: "bar",
    type: "kent_ofsted_yearly", 
    area: area ? "local" : "county",
    chart: {
      groups: groups, // Pass in array of yearly groups
      title: "Ofsted Rankings Over Time",
      xlabel: "Academic Year",
      ylabel: "Number of Schools",
    },
  };

  return response;
};

export const flood_risk_frequency_by_postcode = async (
  postcodes: string[],
): 

  Promise<BarChartResponse> => {
  
  if (postcodes.length == 0){
    return (
    {
      chartType: "bar",
      type: "flood_data",
      area: "postcode",

      chart: {
        groups: [{
          name: "null",
          bars: [{
            bar_name: "none",
            value: 0,
            color: "black",
          }]
        }],
        title: "Kent Postcode Flood Risks",
        xlabel: "Postcodes",
        ylabel: "Frequency",
      }
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

  const groups = response.data.map((group: any) => ({
    name: group.postcode,
    bars: [
      { bar_name: "High Risk", value: group.frs_count_high, color: "red" },
      {
        bar_name: "Medium Risk",
        value: group.frs_count_medium,
        color: "orange",
      },
      { bar_name: "Low Risk", value: group.frs_count_low, color: "yellow" },
      {
        bar_name: "Very Low Risk",
        value: group.frs_count_very_low,
        color: "green",
      },
    ],
  }));

  const bar_return: BarChartResponse = {
    chartType: "bar",
    type: "flood_data",
    area: "postcode",

    chart: {
      groups,
      title: "Kent Postcode Flood Risks",
      xlabel: "Postcodes",
      ylabel: "Frequency",
    },
  };
  return bar_return;
};
