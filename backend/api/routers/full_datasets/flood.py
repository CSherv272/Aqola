from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.db_models import Flood
from api.models.response_models.flood import FloodResponse

router = APIRouter()

@router.get("/")
async def list_flood(db: Session = Depends(get_db)):
    """List all flood data"""
    floodData = (
        db.query(Flood)
        .all()
    )
    
    return [
        FloodResponse(
            postcode=floodRow.postcode,
            frs_band=floodRow.frs_band,
            frs_count_high=floodRow.frs_count_high,
            frs_count_medium=floodRow.frs_count_medium,
            frs_count_low=floodRow.frs_count_low,
            frs_count_very_low=floodRow.frs_count_very_low,
        )
        for floodRow in floodData
    ]