from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional

class FloodResponse(BaseModel):
    postcode: str
    frs_band: Optional[str]
    frs_count_high: int
    frs_count_medium: int
    frs_count_low: int
    frs_count_very_low: int

    class Config:
        from_attributes = True # Allows SQL Alchemy to convert to this.


class RiskBand(BaseModel):
    postcode: str
    frs_band: Optional[str]

    class Config:
        from_attributes = True
