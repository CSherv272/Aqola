/*NOTE: This query performs vaidation beyond standard schema constraints. While
NOT NULL constraints exist in the schema, they do not catch logically incorrect nulls/values.

This means
- whitespace or empty strings checked by Regex (~ '^\s*$')
- Malformed strings are not there checked by TRIM()
- 'NaN' or negative values
- coordinates have appropriate values/bounds restricted to Kent.
    - latitude bounds: South(50.88 degrees) to North(51.52 degrees)
    - longitude bounds: West(0.01  degrees) to East(1.47 degrees)
- no negative values where appropriate
- ST_IsEmpty is used to check if the spatial area geometries are empty
*/

WITH completeness_failures AS (
    --Display zones
    SELECT 'display_zones' AS tbl, 'name' AS col, 'Logical Null (Empty/Spaces)' AS issue, id::text AS row_id
    FROM display_zones WHERE name ~ '^\s*$'
    UNION ALL
    SELECT 'display_zones', 'name', 'Malformed (Trailing/Leading Space)', id::text
    FROM display_zones WHERE name != TRIM(name)
    UNION ALL
    SELECT 'display_zones', 'zone_code', 'Logical Null (Empty/Spaces)', id::text
    FROM display_zones WHERE zone_code ~ '^\s*$'
    UNION ALL
    SELECT 'display_zones', 'zone_code', 'Malformed (Trailing/Leading Space)', id::text
    FROM display_zones WHERE zone_code != TRIM(zone_code)
    UNION ALL
    SELECT 'display_zones', 'population', 'Negative Value', id::text
    FROM display_zones WHERE population < 0
    UNION ALL
    SELECT 'display_zones', 'area_sq_km', 'Negative Value', id::text
    FROM display_zones WHERE area_sq_km < 0
    UNION ALL
    SELECT 'display_zones', 'population', 'NaN (Not a Number)', id::text
    FROM display_zones WHERE population::text = 'NaN'
    UNION ALL
    SELECT 'display_zones', 'zone_code', 'Duplicate Key', zone_code
    FROM display_zones GROUP BY zone_code HAVING COUNT(*) > 1

    UNION ALL

    --Statistical areas
    SELECT 'statistical_areas', 'lsoa_id', 'Logical Null (Empty/Spaces)', lsoa_id::text
    FROM statistical_areas WHERE lsoa_id ~ '^\s*$'
    UNION ALL
    SELECT 'statistical_areas', 'lsoa_id', 'Malformed (Trailing/Leading Space)', lsoa_id::text
    FROM statistical_areas WHERE lsoa_id != TRIM(lsoa_id)
    UNION ALL
    SELECT 'statistical_areas', 'area_name', 'Logical Null (Empty/Spaces)', lsoa_id::text
    FROM statistical_areas WHERE area_name ~ '^\s*$'
    UNION ALL
    SELECT 'statistical_areas', 'boundary', 'Empty Geometry', lsoa_id::text
    FROM statistical_areas WHERE ST_IsEmpty(boundary)
    UNION ALL
    SELECT 'statistical_areas', 'centroid', 'Empty Geometry', lsoa_id::text
    FROM statistical_areas WHERE ST_IsEmpty(centroid)
    UNION ALL
    SELECT 'statistical_areas', 'lsoa_id', 'Duplicate Key', lsoa_id
    FROM statistical_areas GROUP BY lsoa_id HAVING COUNT(*) > 1

    UNION ALL

    --Postcodes
    SELECT 'postcodes', 'postcode', 'Logical Null (Empty/Spaces)', postcode::text
    FROM postcodes WHERE postcode ~ '^\s*$'
    UNION ALL
    SELECT 'postcodes', 'postcode', 'Malformed (Trailing/Leading Space)', postcode::text
    FROM postcodes WHERE postcode != TRIM(postcode)
    UNION ALL
    SELECT 'postcodes', 'stat_area_id', 'Malformed (Trailing Space)', postcode::text
    FROM postcodes WHERE stat_area_id != TRIM(stat_area_id)
    UNION ALL
    SELECT 'postcodes', 'postcode', 'Duplicate Key', postcode
    FROM postcodes GROUP BY postcode HAVING COUNT(*) > 1

    UNION ALL

    --Crime data
    SELECT 'crime_data', 'crime_type', 'Logical Null (Empty/Spaces)', id::text
    FROM crime_data WHERE crime_type ~ '^\s*$'
    UNION ALL
    SELECT 'crime_data', 'crime_type', 'Malformed (Trailing/Leading Space)', id::text
    FROM crime_data WHERE crime_type != TRIM(crime_type)
    UNION ALL
    SELECT 'crime_data', 'latitude', 'Out of Kent Bounds', id::text
    FROM crime_data WHERE latitude NOT BETWEEN 50.88 AND 51.52
    UNION ALL
    SELECT 'crime_data', 'longitude', 'Out of Kent Bounds', id::text
    FROM crime_data WHERE longitude NOT BETWEEN 0.01 AND 1.47
)
SELECT tbl, col, issue, COUNT(*) AS issue_count, ARRAY_AGG(row_id) AS failing_ids
FROM completeness_failures
GROUP BY tbl, col, issue;