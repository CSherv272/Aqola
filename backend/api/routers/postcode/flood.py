from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import Flood
from api.models.response_models.flood import FloodResponse
from api.models.response_models.flood import RiskBand
from datetime import date
from sqlalchemy import func

router = APIRouter()


# get crime for an LSOA (and can filter by month and a list of crime types)
# get multiple crime types and by a specific month: http://localhost:8000/crime/lsoa/E01023987?crimeType=Other%20theft&crimeType=Drugs
@router.get("/{postcode}/flood", response_model=List[FloodResponse])
async def get_flood_by_postcode(
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
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode entered")

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

@router.get("/{postcode}/flood/riskband", response_model= RiskBand)
async def get_risk_band_by_postcode(
    postcode: str,
    db: Session = Depends(get_db)
):
    # query for that lsoa
    query = (
        db.query(Flood)
        .with_entities(Flood.postcode, Flood.frs_band)
        .filter(func.lower(Flood.postcode) == func.lower(postcode))
        
    )

    pcdRecord = query.first()

    if not pcdRecord:
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode entered")

    return (
        RiskBand(
            postcode=pcdRecord.postcode,
            frs_band=pcdRecord.frs_band
        )
    )