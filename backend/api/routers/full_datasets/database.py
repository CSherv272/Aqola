from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from api.database import get_db
from api.models.db_models import Flood
from api.models.response_models.flood import FloodResponse

router = APIRouter()

@router.get("/tablenames")
async def table_names(db: Session = Depends(get_db)):
    """List all flood data"""
    inspector = inspect(db.bind)
    tables = inspector.get_table_names()
    tables.remove("spatial_ref_sys")
    return {"tables": tables}