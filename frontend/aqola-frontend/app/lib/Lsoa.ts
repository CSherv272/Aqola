import { api } from "./Api";
import {
  LsoaGeoJson,
  LsoaPolygonResponse,
  LsoaResponse,
} from "./PolygonModels";

export const getLsoa = async (lsoa: string): Promise<LsoaResponse> => {
  const response = await api.get(`/lsoas/${lsoa}`);
  return response.data;
};

type BoundsParams = {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
};

export const getLsoaBoundaries = async (
  bounds: BoundsParams,
): Promise<LsoaGeoJson[]> => {
  const response = await api.get(`/lsoas/geometry`, {
    params: {
      min_lat: bounds.min_lat,
      max_lat: bounds.max_lat,
      min_lng: bounds.min_lng,
      max_lng: bounds.max_lng,
    },
  });

  console.log("found " + response.data.length + "  lsoas");

  return response.data.map((item: LsoaPolygonResponse) => ({
    type: "Feature" as const,
    geometry: item.boundary,
    properties: {
      lsoa: item.lsoa,
    },
  }));
};
