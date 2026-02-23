from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class SchoolResponse(BaseModel):
    urn = int
    lsoa_id = str
    school_name = str
    postcode = str
    is_primary = bool
    is_secondary = bool
    is_post16 = bool
    gender = str
    year_range = str
    ofsted_ranking =int
    # centroid = Column(Geometry('POINT', srid=4326))
    latitude = float
    longitude = float
    
    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
