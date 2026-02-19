from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from api.database import get_db
from api.models.db_models import Crime
from api.models.crime import CrimeResponse

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

@router.get("/{lsoa}", response_model=List[CrimeResponse])
async def get_crime_by_postcode(lsoa: str, db: Session = Depends(get_db)):
    """List postcodes"""
    lsoa_records = (
        db.query(Crime)
        .filter(func.lower(Crime.lsoa_id) == func.lower(lsoa))
        .all()
    )

    if not lsoa_records:
        raise HTTPException(status_code=404, detail="Postcode not found")

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
