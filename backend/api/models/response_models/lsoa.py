from pydantic import BaseModel
from decimal import Decimal
from api.models.response_models.polygon import GeometryModel, PolygonResponse

class LsoaResponse(BaseModel):
    lsoa_id: str
    area_name: str
    population: int
    area_sq_km: float
    boundary: GeometryModel
    centroid: GeometryModel

    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.


class LsoaPolygonResponse(PolygonResponse):
    lsoa: str