from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse
from sqlalchemy import func
from typing import List, Optional

router = APIRouter()



@router.get("/")
async def list_schools(
    lsoas: Optional[List[str]] = Query(default=None),
    postcodes: Optional[List[str]] = Query(default=None),
    db: Session = Depends(get_db)):
    """Lists all school data"""
    query = (
        db.query(School)
    )

    if lsoas:
        query = query.filter(School.lsoa_id.in_(lsoas))

    if postcodes:
        query = query.filter(School.postcode.in_(postcodes)) 
    
    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode(s)/lsoa(s) entered")

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
            centroid = schoolRow.centroid,
            latitude = schoolRow.latitude,
            longitude = schoolRow.longitude
        )
        for schoolRow in results
    ]

@router.get("/ofsted-count")
async def get_school_ofsted_counts(
    lsoas: Optional[List[str]] = Query(default=None),
    postcodes: Optional[List[str]] = Query(default=None),
    db: Session = Depends(get_db)):
    """Lists counts of schools by Ofsted ranking"""
    
    query = (
        db.query(School.ofsted_ranking, func.count(School.ofsted_ranking))
        .group_by(School.ofsted_ranking)
    )

    if lsoas:
        query = query.filter(School.lsoa_id.in_(lsoas))

    if postcodes:
        query = query.filter(School.postcode.in_(postcodes)) 

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No records found. Double check the postcode(s)/lsoa(s) entered")
    
    return {
        "ofsted_rankings":[
        {
            "ranking": ranking,
            "count": count
        }
        for ranking, count in results
    ]}