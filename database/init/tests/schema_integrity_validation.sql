-- Query to verify that all necessary tables are present according to  schema
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

-- Query to check the correct columns and data types are present in each table
SELECT 
    table_name, 
    column_name, 
    data_type, 
    numeric_precision,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'display_zones',
    'statistical_areas',
    'postcodes',
    'crime_data')
ORDER BY table_name, column_name;

-- Query to check the relational constraints (Primary and Foreign Keys)
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type, 
    kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu 
    ON tc.constraint_name = kcu.constraint_name 
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('display_zones', 'statistical_areas', 'postcodes', 'crime_data')
AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
ORDER BY tc.table_name;
