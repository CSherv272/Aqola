from pydantic import BaseModel
from decimal import Decimal

class SchoolResponse(BaseModel):
    urn: str
    lsoa_id: str
    school_name: str
    postcode: str
    is_primary: bool
    is_secondary: bool
    is_post16: bool
    gender: str
    year_range: str
    ofsted_ranking: int
    # centroid: Column(Geometry('POINT', srid=4326))
    latitude: Decimal
    longitude: Decimal
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
