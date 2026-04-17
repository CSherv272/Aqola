import { Feature, Polygon, MultiPolygon } from "geojson";
import { BarChartResponse, LineChartResponse } from "./frontend_models";

type PostcodeProperties = {
  postcode: string;
};

type PostcodeGeoJson = Feature<Polygon | MultiPolygon, PostcodeProperties>;

type PostcodeResponse = {
  postcode: string;
  boundary: PostcodeGeoJson;
};

type PostcodePolygonResponse = {
  postcode: string;
  boundary: Polygon | MultiPolygon;
};

type chartData = BarChartResponse | LineChartResponse | null;

type YearlyRankingRecord = {
  year_range: string;
  ranking: number;
  count: number;
};

type YearlyOfstedResponse = {
  yearly_rankings: YearlyRankingRecord[];
};

type GenderDemographicRecord = {
  phase: string;
  gender: string;
  count: number;
};

type GenderDemographicsResponse = {
  "gender-demographics": GenderDemographicRecord[];
};

export {
  type PostcodeGeoJson,
  type PostcodeResponse,
  type PostcodePolygonResponse,
  type chartData,
  type YearlyOfstedResponse,
  type GenderDemographicsResponse,
};
