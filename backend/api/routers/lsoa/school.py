from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse

router = APIRouter()


# get school data for an LSOA
@router.get("/{lsoa}/school", response_model=List[SchoolResponse])
async def get_school_by_lsoa(
    lsoa: str,
    db: Session = Depends(get_db)
):
    # query for that lsoa
    query = (
        db.query(School)
        .filter(func.lower(School.lsoa_id) == func.lower(lsoa))
    )

    pcdRecords = query.all()

    if not pcdRecords:
        raise HTTPException(status_code=404, detail="No records found")

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
        for schoolRow in pcdRecords
    ]

@router.get("/{lsoa}/school/ofstedcount")
async def list_schools(
    lsoa: str,
    db: Session = Depends(get_db)):
    """Lists counts of schools by Ofsted ranking"""
    
    schoolData = (
        db.query(School.ofsted_ranking, func.count(School.ofsted_ranking))
        .filter(func.lower(School.lsoa_id) == func.lower(lsoa))
        .group_by(School.ofsted_ranking)
        .all()
    )

    return {
        "ofsted_rankings":[
        {
            "ranking": ranking,
            "count": count
        }
        for ranking, count in schoolData
    ]}