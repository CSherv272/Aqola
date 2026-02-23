from fastapi.testclient import TestClient
from fastapi import APIRouter, FastAPI

from backend.api.routers.postcode.postcodes import router

app = FastAPI()
app.include_router(router, prefix="/postcodes")
client = TestClient(app)

def test_get_postcode_valid():
    response = client.get("/postcodes/")
    assert response.status_code == 200
    data = response.json()
    assert data[0]["postcode"] == "CT2 7QS"
    assert "latitude" in data[0]
    assert "longitude" in data[0]