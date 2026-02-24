from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from geoalchemy2.functions import ST_AsGeoJSON, ST_Intersects, ST_MakeEnvelope
import json

from api.database import get_db
from api.models.db_models import Postcode
from api.models.postcode import PostcodeResponse, PostcodePolygonResponse
from api.models.polygon import GeometryModel


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
            lsoa_id=p.lsoa_id,
            postcode_area=p.postcode_area,
            postcode_district=p.postcode_district,
            postcode_sector=p.postcode_sector,
            latitude=p.latitude,
            longitude=p.longitude,
            centroid=p.centroid,
            boundary=p.boundary
        )
        for p in postcodes
    ]

@router.get("/geometry", response_model=List[PostcodePolygonResponse])
async def list_postcodes(min_lat: float, max_lat: float, min_lng: float, max_lng: float, db: Session = Depends(get_db)):
    """List postcodes"""
    
    print(f"Bounds received: min_lat={min_lat}, max_lat={max_lat}, min_lng={min_lng}, max_lng={max_lng}")


    postcodes = (
        db.query(
            Postcode.postcode,
            ST_AsGeoJSON(Postcode.boundary).label("boundary")
        ).filter (
            ST_Intersects(
                Postcode.boundary,
                ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
            )
        )
        .all()
    )
    print(f"Found {len(postcodes)} polygons")


    postcode_polygons = []

    for postcode_record in postcodes:
        boundary_json = json.loads(postcode_record.boundary)
        postcode_polygons.append(PostcodePolygonResponse(boundary=GeometryModel(type=boundary_json["type"], coordinates=boundary_json["coordinates"]), postcode=postcode_record.postcode))


    return postcode_polygons


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
        lsoa_id=postcode_record.lsoa_id,
        postcode_area=postcode_record.postcode_area,
        postcode_district=postcode_record.postcode_district,
        postcode_sector=postcode_record.postcode_sector,
        latitude=postcode_record.latitude,
        longitude=postcode_record.longitude,
        centroid=postcode_record.centroid,
        boundary=postcode_record.boundary
    )

@router.get("/{postcode}/geometry", response_model=PostcodePolygonResponse)
async def get_postcode_polygon(postcode:str, db: Session = Depends(get_db)):
    """Get postcode by postcode string"""
    postcode_record = (
        db.query(
            Postcode.postcode,
            ST_AsGeoJSON(Postcode.boundary).label("boundary")
                 )
        .filter(func.lower(Postcode.postcode) == func.lower(postcode))
        .first()
    )
    boundary_json = json.loads(postcode_record.boundary)
    boundary = GeometryModel(type=boundary_json["type"], coordinates=boundary_json["coordinates"])


    if not postcode_record:
        raise HTTPException(status_code=404, detail="Postcode not found")

    return PostcodePolygonResponse(
        postcode=postcode_record.postcode,
        boundary=boundary
    )