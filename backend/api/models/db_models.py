from sqlalchemy import Column, String, Float, Integer, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import uuid

from api.database import Base

class Postcode(Base):
    __tablename__ = "postcodes"
    
    postcode = Column(String(10), unique=True, nullable=False, index=True, primary_key=True)
    lsoa_id = Column(String(20), nullable=False, index=True)
    postcode_area = Column(String(4))
    postcode_district = Column(String(4))
    postcode_sector = Column(String(5))
    latitude = Column(Float)
    longitude = Column(Float)
    centroid = Column(Geometry('POINT', srid=4326))
    
    # # Foreign keys
    # lsoa_id = Column(String(20), ForeignKey('lsoas.id'))
    
    # # Relationships
    # zone = relationship("DisplayZone", back_populates="postcodes")

class Crime(Base):
    __tablename__ = "crime_data"
    
    crime_id = Column(Integer, unique=True, nullable=False, primary_key=True)
    lsoa_id = Column(String(20), nullable=False, index=True)
    date = Column(String(8))
    latitude = Column(Float)
    longitude = Column(Float)
    crime_type = Column(String)

class Flood(Base):
    __tablename__ = "flood_data"
    
    postcode = Column(String, unique=True, nullable=False, primary_key=True)
    frs_band = Column(String)
    frs_count_high = Column(Integer)
    frs_count_medium = Column(Integer)
    frs_count_low = Column(Integer)
    frs_count_very_low = Column(Integer)