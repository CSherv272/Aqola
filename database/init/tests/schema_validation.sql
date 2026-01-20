-- QA audit to verify all necessary tables are present according to  schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'display_zones', 
    'statistical_areas', 
    'postcodes', 
    'crime_data', 
    'spatial_ref_sys'
);
