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
            postcode_area=p.postcode_area,
            postcode_district=p.postcode_district,
            postcode_sector=p.postcode_sector,
            latitude=p.latitude,
            longitude=p.longitude,
        )
        for p in postcodes
    ]
