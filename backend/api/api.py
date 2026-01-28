<<<<<<< HEAD
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
=======
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins ={
    "http://localhost:3000",
    "localhost:3000"
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
>>>>>>> 45dc6d51baad116accd470177a63221002e2e46d
    return {"message": "Hello World"}