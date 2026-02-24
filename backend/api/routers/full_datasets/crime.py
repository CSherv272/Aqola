from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import Crime
from api.models.response_models.crime import UniqueTypesResponse, CrimeResponse, UniqueDatesResponse
from datetime import date

router = APIRouter()

@router.get("/")
async def list_crime(db: Session = Depends(get_db), response_model=CrimeResponse):
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

@router.get("/types")
async def list_crime_types(db: Session = Depends(get_db), response_model= UniqueTypesResponse):
    crimeTypes = (
        db.query(Crime.crime_type)
        .distinct()
        .all()
    )
    
    crimeList = [ct[0] for ct in crimeTypes]
    
    return UniqueTypesResponse(values=crimeList)

@router.get("/months")
async def list_crime_months(db: Session = Depends(get_db), response_model= UniqueDatesResponse):
    crimeTypes = (
        db.query(Crime.date)
        .distinct()
        .all()
    )
    
    crimeList = [ct[0] for ct in crimeTypes]
    
    return UniqueDatesResponse(values=crimeList)

