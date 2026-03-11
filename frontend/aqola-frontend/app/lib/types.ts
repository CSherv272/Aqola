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

export {
  type PostcodeGeoJson,
  type PostcodeResponse,
  type PostcodePolygonResponse,
  type chartData,
};
