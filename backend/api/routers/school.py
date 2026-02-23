from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def welcome():
    return {
        "message": "welcome to the school API, please see documentation for use"
    }