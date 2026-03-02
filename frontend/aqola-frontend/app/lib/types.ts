import { Feature, Polygon, MultiPolygon } from "geojson";

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

export {
  type PostcodeGeoJson,
  type PostcodeResponse,
  type PostcodePolygonResponse,
};
