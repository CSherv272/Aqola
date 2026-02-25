from pydantic import BaseModel
from typing import Optional

# defines geometry type
class GeometryModel(BaseModel):
    type: str
    coordinates: list

# Geometry response type
class PolygonResponse(BaseModel):
    boundary: GeometryModel
