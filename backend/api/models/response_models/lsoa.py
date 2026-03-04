from pydantic import BaseModel
from decimal import Decimal

class LsoaResponse(BaseModel):
    lsoa_id: str
    area_name: str
    population: int
    area_sq_km: float
    # boundary: 
    # centroid: 

    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.