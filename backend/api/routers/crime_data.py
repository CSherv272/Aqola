from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import Crime
from api.models.crime import CrimeResponse
from datetime import date

router = APIRouter()

@router.get("/")
async def list_crime(db: Session = Depends(get_db)):
    """List postcodes"""
    crimes = (
        db.query(Crime)
        .all()
    )
    
    return [
        CrimeResponse(
            crime_id = crime.crime_id,
            lsoa_id=crime.lsoa_id,
            date=crime.date,
            latitude=crime.latitude,
            longitude=crime.longitude,
            crime_type=crime.crime_type
        )
        for crime in crimes
    ]


# get crime for an LSOA (and can filter by month)
# get all crime for lsoa : http://localhost:8000/crime/E01023987
# get all crrime for lsoa in x month: http://localhost:8000/crime/E01023987?month=2022-10-01
@router.get("/lsoa/{lsoa}", response_model=List[CrimeResponse])
async def get_crime_by_postcode(
    lsoa: str,
    month: Optional[date] = None,
    db: Session = Depends(get_db)
):
    # query for that lsoa
    query = (
        db.query(Crime)
        .filter(func.lower(Crime.lsoa_id) == func.lower(lsoa))
    )

    # Only filter by month if it was provided
    if month:
        query = query.filter(Crime.date == month)

    lsoa_records = query.all()

    if not lsoa_records:
        raise HTTPException(status_code=404, detail="No records found")

    return [
        CrimeResponse(
            crime_id=crime.crime_id,
            lsoa_id=crime.lsoa_id,
            date=crime.date,
            latitude=crime.latitude,
            longitude=crime.longitude,
            crime_type=crime.crime_type
        )
        for crime in lsoa_records
    ]
