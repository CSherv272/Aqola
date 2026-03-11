import { GeoJSON } from "react-leaflet";
import { PostcodeGeoJson } from "@/app/lib/types";

interface PolygonProps {
  postcode_name: string;
  color: string;
  postcode_boundary_data: PostcodeGeoJson;
  isSelected?: boolean;
}

const Polygon = ({
  postcode_name,
  color,
  postcode_boundary_data,
  isSelected,
}: PolygonProps) => {
  return (
    <GeoJSON
      key={`${postcode_name}-${isSelected}`} // key change forces re-render when style changes
      data={postcode_boundary_data}
      style={{
        fillColor: isSelected ? "#66b6bd" : color,
        fillOpacity: isSelected ? 0.4 : 0.1,
        color: "#66b6bd",
        weight: isSelected ? 2 : 0.5,
      }}
    />
  );
};

export { Polygon };
