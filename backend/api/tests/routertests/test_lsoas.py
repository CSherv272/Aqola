import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.api.routers.lsoas import router

app = FastAPI()
app.include_router(router, prefix="/lsoas")
client = TestClient(app)


class TestListLsoas:
    def test_status_200(self):
        response = client.get("/lsoas/")
        assert response.status_code == 200

    def test_returns_lsoa_instance(self):
        response = client.get("/lsoas/")
        data = response.json()
        assert len(data) > 0
        first = data[0]
        assert "lsoa_id" in first
        assert "area_name" in first
        assert "population" in first
        assert "area_sq_km" in first

    def test_filter_by_lsoa(self):
        response = client.get("/lsoas/?lsoas=E01023983")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["lsoa_id"] == "E01023983"

    def test_filter_by_multiple_lsoas(self):
        response = client.get("/lsoas/?lsoas=E01023983&lsoas=E01023984")
        assert response.status_code == 200
        data = response.json()
        returned_ids = {item["lsoa_id"] for item in data}
        assert returned_ids.issubset({"E01023983", "E01023984"})

    def test_no_filter_returns_multiple(self):
        response = client.get("/lsoas/")
        data = response.json()
        assert len(data) > 1

    def test_population_is_numeric(self):
        response = client.get("/lsoas/?lsoas=E01023983")
        data = response.json()
        assert isinstance(data[0]["population"], (int, float))

    def test_area_sq_km_is_numeric(self):
        response = client.get("/lsoas/?lsoas=E01023983")
        data = response.json()
        assert isinstance(data[0]["area_sq_km"], (int, float))