from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from api.database import get_db
from sqlalchemy import func
from typing import List, Optional

from api.models.response_models.lsoa import LsoaResponse
from api.models.db_models import Lsoa

router = APIRouter()


@router.get("/", response_model=List[LsoaResponse])
async def list_lsoas(
    lsoas: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)):

    """List all lsoas"""
    query = (
        db.query(Lsoa)
    )

    if lsoas:
        query = query.filter(Lsoa.lsoa_id.in_(lsoas))

    results = query.all()

    return [
        LsoaResponse(
            lsoa_id= result.lsoa_id,
            area_name = result.area_name,
            population= result.population,
            area_sq_km= result.area_sq_km,
        )
        for result in results
    ]