from pydantic import BaseModel
from decimal import Decimal

class CrimeResponse(BaseModel):
    crime_id: str
    lsoa_id: str
    date: str
    latitude: Decimal
    longitude: Decimal
    crime_type: str
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
