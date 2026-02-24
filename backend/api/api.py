from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import postcodes

origins =[
    "http://localhost:3000",
    "localhost:3000"
]

app = FastAPI(
    title="AQOLA API",
    description="Area Quality of Life Analysis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(postcodes.router, prefix="/postcodes")