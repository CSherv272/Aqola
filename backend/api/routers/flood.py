from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from api.database import get_db
from api.models.db_models import Flood
from api.models.response_models.flood import FloodResponse
from api.models.response_models.flood import RiskBand

router = APIRouter()

@router.get("/")
async def list_flood(
    postcodes: Optional[List[str]] = Query(default=None),
    db: Session = Depends(get_db)):
    """List all flood data"""
    query = (
        db.query(Flood)
    )

    if postcodes:
        query = query.filter(Flood.postcode.in_(postcodes)) 
    
    floodData = query.all()

    if not floodData:
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode(s) entered")

    return [
        FloodResponse(
            postcode=floodRow.postcode,
            frs_band=floodRow.frs_band,
            frs_count_high=floodRow.frs_count_high,
            frs_count_medium=floodRow.frs_count_medium,
            frs_count_low=floodRow.frs_count_low,
            frs_count_very_low=floodRow.frs_count_very_low,
        )
        for floodRow in floodData
    ]

# still only returns the top value, no matter how many postcodes inputted.
# Needs changing, but frontend will need changing too
@router.get("/risk-band", response_model= List[RiskBand])
async def get_risk_band_by_postcode(
    postcodes: Optional[List[str]] = Query(default=None),
    db: Session = Depends(get_db)
):
    # query for that lsoa
    query = (
        db.query(Flood.postcode, Flood.frs_band)   
    )

    if postcodes:
        query = query.filter(Flood.postcode.in_(postcodes)) 

    pcdRecords = query.all()

    if not pcdRecords:
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode entered")
    
    return [
            RiskBand(
                postcode=record.postcode,
                frs_band=record.frs_band
            ) 
            for record in pcdRecords 
            if record.frs_band is not None  # Use 'is not None' in Python
        ]