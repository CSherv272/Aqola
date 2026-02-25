from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse
from sqlalchemy import func

router = APIRouter()

@router.get("/")
async def list_schools(db: Session = Depends(get_db)):
    """Lists all school data"""
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

from sqlalchemy import func

@router.get("/ofstedcount")
async def list_schools(db: Session = Depends(get_db)):
    """Lists counts of schools by Ofsted ranking"""
    
    schoolData = (
        db.query(School.ofsted_ranking, func.count(School.ofsted_ranking))
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