from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class CrimeResponse(BaseModel):
    crime_id: int
    lsoa_id: str
    date: date
    latitude: Decimal
    longitude: Decimal
    crime_type: str
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.


class UniqueTypesResponse(BaseModel):
    values: list[str]
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.

class UniqueDatesResponse(BaseModel):
    values: list[date]
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.

# class TimeseriesResponse(BaseModel):
    # line_name:[]
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
