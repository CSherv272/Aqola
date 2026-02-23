from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class FloodResponse(BaseModel):
    postcode: str
    frs_band: str
    frs_count_high: int
    frs_count_medium: int
    frs_count_low: int
    frs_count_very_low: int


    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.
