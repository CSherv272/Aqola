from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import Crime
from api.models.response_models.crime import CrimeResponse
from datetime import date

router = APIRouter()

# get crime for an LSOA (and can filter by month and a list of crime types)
# get multiple crime types and by a specific month: http://localhost:8000/crime/lsoa/E01023987?crimeType=Other%20theft&crimeType=Drugs
@router.get("/{lsoa}/crime", response_model=List[CrimeResponse])
async def get_crime_by_postcode(
    lsoa: str,
    month: Optional[date] = None,
    crimeType: Optional[List[str]] = Query(None),
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

    if crimeType:
        query = query.filter(Crime.crime_type.in_(crimeType))

    lsoa_records = query.all()

    if not lsoa_records:
        return []

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
