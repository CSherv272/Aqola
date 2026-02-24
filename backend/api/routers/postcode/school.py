from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse
from datetime import date

router = APIRouter()

@router.get("/school")
async def welcome():
    return {
        "message": "welcome to the school API, please see documentation for use"
    }

@router.get("/school")
async def list_schools(db: Session = Depends(get_db)):
    """List postcodes"""
    schoolData = (
        db.query(School)
        .all()
    )
    
    return [
        SchoolResponse(
            urn = schoolRow.urn,
            lsoa_id = schoolRow.lsoa_id,
            school_name = schoolRow.school_name,
            postcode = schoolRow.postcode,
            is_primary = schoolRow.is_primary,
            is_secondary = schoolRow.is_secondary,
            is_post16 = schoolRow.is_post16,
            gender = schoolRow.gender,
            year_range = schoolRow.year_range,
            ofsted_ranking = schoolRow.ofsted_ranking,
            # centroid = Column(Geometry('POINT', srid=4326))
            latitude = schoolRow.latitude,
            longitude = schoolRow.longitude
        )
        for schoolRow in schoolData
    ]


# get crime for an LSOA (and can filter by month and a list of crime types)
# get multiple crime types and by a specific month: http://localhost:8000/crime/lsoa/E01023987?crimeType=Other%20theft&crimeType=Drugs
@router.get("/{postcode}/school")
async def get_schools_by_postcode(postcode: str, db: Session = Depends(get_db)):
    """Fetch all schools for a specific postcode for graph representation"""
    schools = (
        db.query(School)
        .filter(func.lower(School.postcode) == func.lower(postcode))
        .all()
    )

    if not schools:
        raise HTTPException(status_code=404, detail="Postcode not found")

    return [
        {
            "school_name": s.school_name,
            "year_range": s.year_range,
            "ofsted_ranking": s.ofsted_ranking,
            "is_primary": s.is_primary,
            "is_secondary": s.is_secondary,
            "is_post16": s.is_post16,
            "gender": s.gender
        }
        for s in schools
    ]
