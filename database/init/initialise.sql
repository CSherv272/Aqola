CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS postcodes CASCADE;
DROP TABLE IF EXISTS crime_data CASCADE;
DROP TABLE IF EXISTS lsoas CASCADE;
DROP TABLE IF EXISTS flood_data CASCADE;


CREATE TABLE IF NOT EXISTS lsoas (
    lsoa_id VARCHAR(20) PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    population INT,
    area_sq_km DECIMAL(10,4),
    boundary GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    centroid GEOMETRY(POINT, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS postcodes (
    postcode VARCHAR(10) PRIMARY KEY,
    lsoa_id VARCHAR(20) NOT NULL REFERENCES lsoas(lsoa_id) ON DELETE CASCADE,
    postcode_area VARCHAR(4) NOT NULL,
    postcode_district VARCHAR(4) NOT NULL,
    postcode_sector VARCHAR(5) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    boundary GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    centroid GEOMETRY(POINT, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS crime_data (
    crime_id SERIAL PRIMARY KEY,
    lsoa_id VARCHAR(20) NOT NULL REFERENCES lsoas(lsoa_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    crime_type VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS flood_data (
    flood_id SERIAL PRIMARY KEY,
    postcode VARCHAR(10) NOT NULL REFERENCES postcodes(postcode) ON DELETE CASCADE,
    frs_band VARCHAR(20),
    frs_count_high INT,
    frs_count_medium INT,
    frs_count_low INT,
    frs_count_very_low INT
);

CREATE TABLE IF NOT EXISTS school_data (
    urn INT PRIMARY KEY,
    lsoa_id VARCHAR(20) NOT NULL REFERENCES lsoas(lsoa_id) ON DELETE CASCADE,
    school_name VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL REFERENCES postcodes(postcode) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL,
    is_secondary BOOLEAN NOT NULL,
    is_post16 BOOLEAN NOT NULL,
    gender VARCHAR(6) NOT NULL,
    year_range VARCHAR(10) NOT NULL,
    ofsted_ranking INT,
    centroid GEOMETRY(POINT, 4326) NOT NULL
);


-- INSERT INTO lsoas (lsoa_id, area_name, population, area_sq_km, boundary, centroid)
-- VALUES
--     ('E01024101', 'Canterbury 013C', 1500, 0.85,
--     ST_GeomFromText('MULTIPOLYGON(((-0.573 51.280, -0.570 51.280, -0.570 51.282, -0.573 51.282, -0.573 51.280)))', 4326),
--     ST_GeomFromText('POINT(-0.5715 51.281)', 4326)
--     );

-- INSERT INTO postcodes (lsoa_id, postcode, postcode_area, postcode_district, postcode_sector, latitude, longitude, centroid, boundary)
-- VALUES
--     ('E01024101', 'CT2 7QS', 'CT', 'CT2', 'CT2 7', 51.294936, 1.0888,
--     ST_GeomFromText('POINT(51.294936 1.0888)', 4326),
--     ST_GeomFromText('MULTIPOLYGON(((-0.573 51.280, -0.570 51.280, -0.570 51.282, -0.573 51.282, -0.573 51.280)))', 4326)
--     );

-- INSERT INTO crime_data (lsoa_id, date, latitude, longitude, crime_type)
-- VALUES
--     ('E01024101', '2024-05-15', 51.2815, 1.0710, 'Burglary');  