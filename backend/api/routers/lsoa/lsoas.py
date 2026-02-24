from fastapi import APIRouter, Depends, HTTPException
from api.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from api.models.response_models.lsoa import LsoaResponse
from api.models.db_models import Lsoa

router = APIRouter()


@router.get("/", response_model=List[LsoaResponse])
async def list_postcodes(db: Session = Depends(get_db)):
    """List postcodes"""
    query = (
        db.query(Lsoa)
        .all()
    )

    return [
        LsoaResponse(
            lsoa_id= result.lsoa_id,
            area_name = result.area_name,
            population= result.population,
            area_sq_km= result.area_sq_km,
        )
        for result in query
    ]

@router.get("/{lsoa}", response_model=LsoaResponse)
async def get_postcode(lsoa: str, db: Session = Depends(get_db)):
    """Get postcode by postcode string"""
    query = (
        db.query(Lsoa)
        .filter(func.lower(Lsoa.lsoa_id) == func.lower(lsoa))
        .first()
    )

    if not query:
        raise HTTPException(status_code=404, detail="Postcode not found")

    return LsoaResponse(
        lsoa_id= query.lsoa_id,
        area_name = query.area_name,
        population= query.population,
        area_sq_km= query.area_sq_km,
    )