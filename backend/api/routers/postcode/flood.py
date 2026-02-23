from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import Flood
from api.models.response_models.flood import FloodResponse
from datetime import date

router = APIRouter()

@router.get("/flood")
async def welcome():
    return {
        "message": "welcome to the flood API, please see documentation for use"
    }

@router.get("/postcode")
async def list_crime(db: Session = Depends(get_db)):
    """List postcodes"""
    floodData = (
        db.query(Flood)
        .all()
    )
    
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


# get crime for an LSOA (and can filter by month and a list of crime types)
# get multiple crime types and by a specific month: http://localhost:8000/crime/lsoa/E01023987?crimeType=Other%20theft&crimeType=Drugs
@router.get("/{postcode}/flood", response_model=List[FloodResponse])
async def get_crime_by_postcode(
    postcode: str,
    db: Session = Depends(get_db)
):
    # query for that lsoa
    query = (
        db.query(Flood)
        .filter(func.lower(Flood.postcode) == func.lower(postcode))
    )

    pcdRecords = query.all()

    if not pcdRecords:
        raise HTTPException(status_code=404, detail="No records found")

    return [
        FloodResponse(
            postcode=floodRow.postcode,
            frs_band=floodRow.frs_band,
            frs_count_high=floodRow.frs_count_high,
            frs_count_medium=floodRow.frs_count_medium,
            frs_count_low=floodRow.frs_count_low,
            frs_count_very_low=floodRow.frs_count_very_low,
        )
        for floodRow in pcdRecords
    ]
