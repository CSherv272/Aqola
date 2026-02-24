from fastapi.testclient import TestClient
from fastapi import APIRouter, FastAPI

from api.routers.postcode.school import router

app = FastAPI()
app.include_router(router, prefix="/postcodes")
client = TestClient(app)

def test_get_school_data_valid():
    response = client.get(f"/postcodes/DA28DH/school")
    assert response.status_code == 200
    data = response.json()
    assert data[0]["school_name"] == "Darenth Community Primary School"
    assert "ofsted_ranking" in data[0]
    assert "is_primary" in data[0]
    assert "is_secondary" in data[0]
    assert "is_post16" in data[0]
    assert "gender" in data[0]
