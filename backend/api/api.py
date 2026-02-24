from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers.postcode import postcodes
from api.routers.lsoa import crime
from api.routers.postcode import flood
from api.routers.lsoa import lsoas
from api.routers.postcode import school as school_pcd
from api.routers.lsoa import school as school_lsoa
from api.routers.full_datasets import crime as crime_full
from api.routers.full_datasets import flood as flood_full
from api.routers.full_datasets import school as school_full
from api.routers.full_datasets import database

origins ={
    "http://localhost:3000",
    "localhost:3000"
}

app = FastAPI(
    title="AQOLA API",
    description="Area Quality of Life Analysis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(postcodes.router, prefix="/postcodes")
app.include_router(crime.router, prefix="/lsoas")
app.include_router(flood.router, prefix="/postcodes")
app.include_router(lsoas.router, prefix="/lsoas")
app.include_router(school_lsoa.router, prefix="/lsoas")
app.include_router(school_pcd.router, prefix="/postcodes")
app.include_router(crime_full.router, prefix="/crime")
app.include_router(flood_full.router, prefix="/flood")
app.include_router(database.router, prefix="/database")