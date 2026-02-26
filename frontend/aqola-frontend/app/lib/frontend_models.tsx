export type BarChartResponse = {
  chartType: "bar";
  type: string,
  area: string;
  chart: {
    groups: {
      name: string;
      bars: {
        bar_name: string;
        value: number;
        color: string;
      }[];
    }[];
    title: string;
    xlabel: string;
    ylabel: string;
  };
};

export type LineChartResponse = {
  chartType: "line";
  type: string,
  area: string;
  chart: {
    lines: {
      line_name: string,
      coords: [Date, number][]
    }[],
    title: string,
    xlabel: string;
    ylabel: string;
  };
};

// type for determining which chart button is clicked
export type ChartType = "line_over_time" | "bar_frequency" | "api_bar";