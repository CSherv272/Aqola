from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.db_models import Crime
from api.models.response_models.crime import ListStringsResponse, CrimeResponse, ListDatesResponse, CrimeRateResponse
from datetime import date
from typing import List
from sqlalchemy import func
from collections import defaultdict

router = APIRouter()

@router.get("/")
async def list_crime(db: Session = Depends(get_db), response_model=CrimeResponse):
    """List all crime"""
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
async def list_crime_types(db: Session = Depends(get_db), response_model= ListStringsResponse):
    crimeTypes = (
        db.query(Crime.crime_type)
        .distinct()
        .all()
    )
    
    crimeList = [ct[0] for ct in crimeTypes]
    
    return ListStringsResponse(values=crimeList)

@router.get("/months")
async def list_crime_months(db: Session = Depends(get_db), response_model= ListDatesResponse):
    crimeTypes = (
        db.query(Crime.date)
        .distinct()
        .all()
    )
    
    crimeList = [ct[0] for ct in crimeTypes]
    
    return ListDatesResponse(values=crimeList)


@router.get("/crime-rate")
async def crime_rate(
    lsoas: List[str] = Query(None),
    db: Session = Depends(get_db)):

    query = (db.query(Crime.lsoa_id, Crime.date, func.count().label("count"))
        .filter(Crime.lsoa_id.in_(lsoas))
        .group_by(Crime.date, Crime.lsoa_id)
        .order_by(Crime.date)
    )

    results = query.all()

    dataDict = defaultdict(list)

    for result in results:
        coords = [result.date, result.count]
        dataDict[result.lsoa_id].append(coords)

    return dataDict

