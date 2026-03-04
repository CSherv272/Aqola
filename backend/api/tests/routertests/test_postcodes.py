from fastapi.testclient import TestClient
from fastapi import APIRouter, FastAPI

from backend.api.routers.full_datasets.postcodes import router

app = FastAPI()
app.include_router(router, prefix="/postcodes")
client = TestClient(app)

VALID_POSTCODE_STARTS = ["CT", "BR", "TN", "DA", "ME"]

def test_get_postcode_valid():
    response = client.get("/postcodes/CT27QS")
    assert response.status_code == 200
    data = response.json()
    assert data["postcode"][0:2] in VALID_POSTCODE_STARTS
    assert "latitude" in data
    assert "longitude" in data

def test_get_specific_postcode():
    response = client.get("/postcodes/CT27QS")
    assert response.status_code == 200
    data = response.json()
    assert data["postcode"] == "CT27QS"

def test_get_postcode_polygon_valid():
    response = client.get("postcodes/CT27QS/geometry")
    assert response.status_code == 200
    data = response.json()
    assert len(data) != 0
    assert "postcode" in data
    assert "boundary" in data
    assert "type" in data["boundary"]
    assert "coordinates" in data["boundary"] 

def test_get_postcode_polygons_with_bounds():
    response = client.get("postcodes/geometry", params={
        "min_lat": 51.243876,
        "max_lat": 51.2469,
        "min_lng": 1.3500,
        "max_lng": 1.436652,
    })
    assert response.status_code == 200
    data = response.json()
    for postcode_boundary_response in data:
        assert postcode_boundary_response["postcode"][0:2] in VALID_POSTCODE_STARTS
