import { api } from "./api";
import {
  PostcodeGeoJson,
  PostcodePolygonResponse,
  PostcodeResponse,
} from "../types";

export const getPostcode = async (
  postcode: string,
): Promise<PostcodeResponse> => {
  const response = await api.get(`/postcodes/${postcode}`);
  return response.data;
};

type BoundsParams = {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
};

export const getPostcodeBoundaries = async (
  bounds: BoundsParams,
): Promise<PostcodeGeoJson[]> => {
  const response = await api.get(`/postcodes/geometry`, {
    params: {
      min_lat: bounds.min_lat,
      max_lat: bounds.max_lat,
      min_lng: bounds.min_lng,
      max_lng: bounds.max_lng,
    },
  });

  console.log("found " + response.data.length + " polygons");

  return response.data.map((item: PostcodePolygonResponse) => ({
    type: "Feature" as const,
    geometry: item.boundary,
    properties: {
      postcode: item.postcode,
    },
  }));
};
