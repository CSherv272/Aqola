from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse
from datetime import date

router = APIRouter()

# get school data for a postcode
@router.get("/{postcode}/school")
async def get_schools_by_postcode(postcode: str, db: Session = Depends(get_db)):
    """Fetch all schools for a specific postcode for graph representation"""
    schools = (
        db.query(School)
        .filter(func.lower(School.postcode) == func.lower(postcode))
        .all()
    )

    if not schools:
        raise HTTPException(status_code=404, detail="Postcode not found for school")

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
