from sqlalchemy import Column, String, Float, Integer, ForeignKey, Index, Boolean, DECIMAL
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

class SchoolData(Base):
    __tablename__ = "school_data"

    urn = Column(String(20), primary_key=True, nullable=False)
    year_range = Column(String(10), primary_key=True, nullable=False)
    school_name = Column(String(255), nullable=False)
    lsoa_id = Column(String(20), index=True)
    postcode = Column(String(10), index=True)
    is_primary = Column(Boolean, nullable=False)
    is_secondary = Column(Boolean, nullable=False)
    is_post16 = Column(Boolean, nullable=False)
    gender = Column(String(6), nullable=False)
    ofsted_ranking = Column(Integer)
    latitude = Column(DECIMAL(9, 6))
    longitude = Column(DECIMAL(9, 6))
    centroid = Column(Geometry('POINT', srid=4326))
    
    