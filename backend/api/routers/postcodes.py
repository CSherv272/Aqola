from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from api.database import get_db
from api.models.db_models import Postcode
from api.models.postcode import PostcodeResponse

router = APIRouter()

@router.get("/", response_model=List[PostcodeResponse])
async def list_postcodes(db: Session = Depends(get_db)):
    """List postcodes"""
    postcodes = (
        db.query(Postcode)
        .all()
    )

    return [
        PostcodeResponse(
            postcode=p.postcode,
            stat_area_id=p.stat_area_id,
            postcode_area=p.postcode_area,
            postcode_district=p.postcode_district,
            postcode_sector=p.postcode_sector,
            latitude=p.latitude,
            longitude=p.longitude,
        )
        for p in postcodes
    ]

@router.get("/{postcode}", response_model=PostcodeResponse)
async def get_postcode(postcode: str, db: Session = Depends(get_db)):
    """Get postcode by postcode string"""
    postcode_record = (
        db.query(Postcode)
        .filter(func.lower(Postcode.postcode) == func.lower(postcode))
        .first()
    )

    if not postcode_record:
        raise HTTPException(status_code=404, detail="Postcode not found")

    return PostcodeResponse(
        postcode=postcode_record.postcode,
        stat_area_id=postcode_record.stat_area_id,
        postcode_area=postcode_record.postcode_area,
        postcode_district=postcode_record.postcode_district,
        postcode_sector=postcode_record.postcode_sector,
        latitude=postcode_record.latitude,
        longitude=postcode_record.longitude,
    )