from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from api.database import get_db
from api.models.db_models import School
from api.models.response_models.school import SchoolResponse
from datetime import date

router = APIRouter()


# get crime for an LSOA (and can filter by month and a list of crime types)
# get multiple crime types and by a specific month: http://localhost:8000/crime/lsoa/E01023987?crimeType=Other%20theft&crimeType=Drugs
@router.get("/{lsoa}/school", response_model=List[SchoolResponse])
async def get_school_by_postcode(
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