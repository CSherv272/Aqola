from pydantic import BaseModel, field_validator
from typing import Optional
from decimal import Decimal
from backend.api.models.response_models.polygon import GeometryModel, PolygonResponse
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

class PostcodeResponse(BaseModel):
    postcode: str
    lsoa_id: str
    postcode_area: str
    postcode_district: str
    postcode_sector: str
    latitude: Decimal
    longitude: Decimal
    centroid: GeometryModel
    boundary: GeometryModel
    
    @field_validator("centroid", "boundary", mode="before")
    @classmethod
    def parse_geometry(cls, v):
        if v is None:
            return None
        
        # Converts geometry into GeoJSON-style dictionary
        shape = to_shape(v)
        return mapping(shape)

    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.

class PostcodePolygonResponse(PolygonResponse):
    postcode: str
    
