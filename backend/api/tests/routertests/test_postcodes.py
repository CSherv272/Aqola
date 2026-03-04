from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.api.routers.postcodes import router

app = FastAPI()
app.include_router(router, prefix="/postcodes")
client = TestClient(app)

VALID_POSTCODE_STARTS = ["CT", "BR", "TN", "DA", "ME"]
KNOWN_POSTCODE = "CT27QS"
UNKNOWN_POSTCODE = "ZZ999ZZ"


class TestListPostcodes:
    def test_status_200(self):
        response = client.get("/postcodes/")
        assert response.status_code == 200

    def test_returns_postcode_instance(self):
        response = client.get("/postcodes/")
        data = response.json()
        assert len(data) > 0
        first = data[0]
        assert "postcode" in first
        assert "lsoa_id" in first
        assert "postcode_area" in first
        assert "postcode_district" in first
        assert "postcode_sector" in first
        assert "latitude" in first
        assert "longitude" in first

    def test_filter_by_postcode(self):
        response = client.get(f"/postcodes/?postcodes={KNOWN_POSTCODE}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["postcode"] == KNOWN_POSTCODE

    def test_filter_by_multiple_postcodes(self):
        response = client.get(f"/postcodes/?postcodes={KNOWN_POSTCODE}&postcodes=CT27QT")
        assert response.status_code == 200
        data = response.json()
        returned = {item["postcode"] for item in data}
        assert returned.issubset({KNOWN_POSTCODE, "CT27QT"})

    def test_latitude_and_longitude_are_numeric(self):
        response = client.get(f"/postcodes/?postcodes={KNOWN_POSTCODE}")
        data = response.json()
        assert isinstance(data[0]["latitude"], (int, float))
        assert isinstance(data[0]["longitude"], (int, float))


class TestListPostcodeGeometry:
    def test_status_200(self):
        response = client.get("/postcodes/geometry", params={
            "min_lat": 51.243876,
            "max_lat": 51.2469,
            "min_lng": 1.3500,
            "max_lng": 1.436652,
        })
        assert response.status_code == 200

    def test_returns_geometry_instance(self):
        response = client.get("/postcodes/geometry", params={
            "min_lat": 51.243876,
            "max_lat": 51.2469,
            "min_lng": 1.3500,
            "max_lng": 1.436652,
        })
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            first = data[0]
            assert "postcode" in first
            assert "boundary" in first
            assert "type" in first["boundary"]
            assert "coordinates" in first["boundary"]

    def test_returns_valid_postcode_starts(self):
        response = client.get("/postcodes/geometry", params={
            "min_lat": 51.243876,
            "max_lat": 51.2469,
            "min_lng": 1.3500,
            "max_lng": 1.436652,
        })
        data = response.json()
        for item in data:
            assert item["postcode"][0:2] in VALID_POSTCODE_STARTS

    def test_empty_bounds_returns_empty_list(self):
        response = client.get("/postcodes/geometry", params={
            "min_lat": 0.0,
            "max_lat": 0.001,
            "min_lng": 0.0,
            "max_lng": 0.001,
        })
        assert response.status_code == 200
        assert response.json() == []

    def test_missing_bounds_returns_422(self):
        response = client.get("/postcodes/geometry")
        assert response.status_code == 422


class TestGetPostcode:
    def test_status_200(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}")
        assert response.status_code == 200

    def test_returns_correct_postcode(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}")
        data = response.json()
        assert data["postcode"] == KNOWN_POSTCODE

    def test_returns_valid_postcode_area(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}")
        data = response.json()
        assert data["postcode"][0:2] in VALID_POSTCODE_STARTS

    def test_returns_postcode_fields(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}")
        data = response.json()
        assert "lsoa_id" in data
        assert "postcode_area" in data
        assert "postcode_district" in data
        assert "postcode_sector" in data
        assert "latitude" in data
        assert "longitude" in data

    def test_case_insensitive_lookup(self):
        response_upper = client.get(f"/postcodes/{KNOWN_POSTCODE.upper()}")
        response_lower = client.get(f"/postcodes/{KNOWN_POSTCODE.lower()}")
        assert response_upper.status_code == 200
        assert response_lower.status_code == 200
        assert response_upper.json()["postcode"] == response_lower.json()["postcode"]

    def test_404_for_unknown_postcode(self):
        response = client.get(f"/postcodes/{UNKNOWN_POSTCODE}")
        assert response.status_code == 404


class TestGetPostcodeGeometry:
    def test_status_200(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}/geometry")
        assert response.status_code == 200

    def test_returns_geometry_fields(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}/geometry")
        data = response.json()
        assert "postcode" in data
        assert "boundary" in data
        assert "type" in data["boundary"]
        assert "coordinates" in data["boundary"]

    def test_boundary_type_is_valid_geojson(self):
        response = client.get(f"/postcodes/{KNOWN_POSTCODE}/geometry")
        data = response.json()
        assert data["boundary"]["type"] in ("Polygon", "MultiPolygon")

    def test_404_for_unknown_postcode(self):
        response = client.get(f"/postcodes/{UNKNOWN_POSTCODE}/geometry")
        assert response.status_code == 404