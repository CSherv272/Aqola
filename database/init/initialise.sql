CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS postcodes;
DROP TABLE IF EXISTS statistical_areas;
DROP TABLE IF EXISTS display_zones;
DROP TABLE IF EXISTS crime_data;

CREATE TABLE IF NOT EXISTS display_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone_code VARCHAR(20) NOT NULL,
    population INT,
    area_sq_km DECIMAL(10,2),
    boundary GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    centroid GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS statistical_areas (
    id SERIAL PRIMARY KEY,
    display_zone_id SERIAL NOT NULL REFERENCES display_zones(id) ON DELETE CASCADE,
    area_code VARCHAR(20) NOT NULL,
    area_name VARCHAR(100) NOT NULL,
    area_type VARCHAR(50) NOT NULL,
    population INT,
    area_sq_km DECIMAL(10,4),
    boundary GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    centroid GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS postcodes (
    id SERIAL PRIMARY KEY,
    stat_area_id SERIAL NOT NULL REFERENCES statistical_areas(id) ON DELETE CASCADE,
    postcode VARCHAR(10) UNIQUE NOT NULL,
    postcode_area VARCHAR(4) NOT NULL,
    postcode_district VARCHAR(4) NOT NULL,
    postcode_sector VARCHAR(5) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crime_data (
    id SERIAL PRIMARY KEY,
    lsoa_id SERIAL NOT NULL REFERENCES statistical_areas(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    crime_type VARCHAR(100) NOT NULL
);



INSERT INTO display_zones (name, zone_code, population, area_sq_km, boundary, centroid)
VALUES
    ('Canterbury Display Zone', 'DZ001', 5000, 5.50,
    ST_GeomFromText('MULTIPOLYGON(((-0.580 51.275, -0.565 51.275, -0.565 51.290, -0.580 51.290, -0.580 51.275)))', 4326),
    ST_GeomFromText('POINT(-0.5725 51.2825)', 4326)
    );

INSERT INTO statistical_areas (display_zone_id, area_code, area_name, area_type, population, area_sq_km, boundary, centroid)
VALUES
    (1, 'E01024101', 'Canterbury 013C', 'Lower Layer Super Output Area', 1500, 0.85,
    ST_GeomFromText('MULTIPOLYGON(((-0.573 51.280, -0.570 51.280, -0.570 51.282, -0.573 51.282, -0.573 51.280)))', 4326),
    ST_GeomFromText('POINT(-0.5715 51.281)', 4326)
    );

INSERT INTO postcodes (stat_area_id, postcode, postcode_area, postcode_district, postcode_sector, latitude, longitude, location)
VALUES
    (1, 'CT2 7QS', 'CT', 'CT2', 'CT2 7', 51.294936, 1.0888,
    ST_GeomFromText('POINT(51.294936 1.0888)', 4326)
    );

INSERT INTO crime_data (lsoa_id, date, latitude, longitude, crime_type)
VALUES
    (1, '2024-05-15', 51.2815, -0.5710, 'Burglary');  