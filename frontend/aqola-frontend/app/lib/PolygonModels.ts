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

export {
  type PostcodeGeoJson,
  type PostcodeResponse,
  type PostcodePolygonResponse,
  type LsoaGeoJson,
  type LsoaResponse,
  type LsoaPolygonResponse,
};
