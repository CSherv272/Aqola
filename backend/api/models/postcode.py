from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class PostcodeResponse(BaseModel):
    postcode: str
    stat_area_id: str
    postcode_area: str
    postcode_district: str
    postcode_sector: str
    latitude: Decimal
    longitude: Decimal
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
