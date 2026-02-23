from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers.postcode import postcodes
from api.routers.lsoa import crime
from api.routers.postcode import flood
from api.routers.lsoa import lsoas
from api.routers.postcode import school as school_pcd
from api.routers.lsoa import school as school_lsoa

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

app.include_router(postcodes.router, prefix="/postcode")
app.include_router(crime.router, prefix="/lsoa")
app.include_router(flood.router, prefix="/postcode")
app.include_router(lsoas.router, prefix="/lsoa")
app.include_router(school_lsoa.router, prefix="/lsoa")
app.include_router(school_pcd.router, prefix="/postcode")