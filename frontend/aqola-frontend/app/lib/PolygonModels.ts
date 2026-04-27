import { Feature, Polygon, MultiPolygon } from "geojson";
import { BarChartResponse, LineChartResponse } from "./ChartModels";

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

type LsoaProperties = {
  lsoa: string;
};

type LsoaGeoJson = Feature<Polygon | MultiPolygon, LsoaProperties>;

type LsoaResponse = {
  lsoa: string;
  boundary: LsoaGeoJson;
};

type LsoaPolygonResponse = {
  lsoa: string;
  boundary: Polygon | MultiPolygon;
};

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
  type YearlyOfstedResponse,
  type GenderDemographicsResponse,
  type LsoaGeoJson,
  type LsoaResponse,
  type LsoaPolygonResponse,
};
