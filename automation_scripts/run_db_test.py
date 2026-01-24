import os
import psycopg2 # Python library for working with PostgreSQL databases
from dotenv import load_dotenv

# Loads credentials from .env file
load_dotenv()

def get_db_connection():
    """Helper method to centralize connection logic."""
    return psycopg2.connect(
        host="localhost",
        port="5431",
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )
    
def test_connection():
    try:
        print(f"DEBUG: Connecting with user '{os.getenv('POSTGRES_USER')}' and password '{os.getenv('POSTGRES_PASSWORD')}'")
        conn = get_db_connection()
        print("CONNECTION SUCCESS: Python Runner connected to Docker Database!")
        conn.close()
    except Exception as e:
        print(f"DEBUG: Trying to connect to {os.getenv('POSTGRES_DB')} as {os.getenv('POSTGRES_USER')}")
        print(f"CONNECTION FAILED: {e}")
        
def schema_integrity_validation():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute the SQL check file
        schema_validation_sql_path = r'aqola/database/init/tests/schema_integrity_validation.sql'
        with open(schema_validation_sql_path) as f:
            sql_content = f.read()
            queries = [q.strip() for q in sql_content.split(';') if q.strip()]
            
        cur.execute(queries[0])
        found_tables = [row[0] for row in cur.fetchall()]
        expected_tables = ['display_zones', 'statistical_areas', 'postcodes', 'crime_data']
        
        print("\n---  SCHEMA VALIDATION REPORT ---")
        print("\n---  ARE ALL NECESSARY TABLES PRESENT? ---")
        for table in expected_tables:
            if table in found_tables:
                print(f" PASSED: Table '{table}' found.")
            else:
                print(f" FAILED: Table '{table}' is missing from database.")
        
        # Verify PostGIS is active
        if 'spatial_ref_sys' in found_tables:
            print(" PASSED: PostGIS extension confirmed.")
        else:
            print(" FAILED: PostGIS extension missing.")
        
        
        print("\n")
        print("\n---  ARE ALL NECESSARY COLUMNS AND DATA TYPES IN THE TABLES PRESENT? ---")
        cur.execute(queries[1])
        all_columns = cur.fetchall()
        expected_columns = {
            ('display_zones', 'id', 'integer'), #SERIAL
            ('display_zones', 'name', 'character varying'), #varchar
            ('display_zones', 'zone_code','character varying'), #varchar
            ('display_zones', 'population', 'integer'),
            ('display_zones', 'area_sq_km', 'numeric'), #NUMERIC(10,2)
            ('display_zones', 'boundary', 'USER-DEFINED'), # GEOMETRY(MultiPolygon, 4326)
            ('display_zones', 'centroid', 'USER-DEFINED' ), #GEOMETRY(POINT, 4326)
            
            ('statistical_areas', 'lsoa_id', 'character varying'), #VARCHAR
            ('statistical_areas', 'display_zone_id', 'integer' ), #SERIAL
            ('statistical_areas', 'area_name', 'character varying'), #VARCHAR
            ('statistical_areas', 'population', 'integer'),
            ('statistical_areas', 'area_sq_km', 'numeric'), #DECIMAL
            ('statistical_areas', 'boundary','USER-DEFINED' ),#(MULTIPOLYGON, 4326)
            ('statistical_areas', 'centroid', 'USER-DEFINED'), #GEOMETRY(POINT, 4326)
            
            ('postcodes', 'postcode','character varying'), #VARCHAR
            ('postcodes', 'stat_area_id','character varying'), #VARCHAR
            ('postcodes', 'postcode_area', 'character varying'), #VARCHAR
            ('postcodes', 'postcode_district', 'character varying'), #VARCHAR
            ('postcodes', 'postcode_sector', 'character varying'), #VARCHAR
            ('postcodes', 'latitude', 'numeric'), #DECIMAL(9,6)
            ('postcodes', 'longitude', 'numeric'), #DECIMAL(9,6)
            ('postcodes', 'location', 'USER-DEFINED'), #GEOMETRY(POINT, 4326)
            
            ('crime_data', 'id', 'integer'), #SERIAL
            ('crime_data', 'date', 'date'), #DATE
            ('crime_data', 'longitude', 'numeric'), #DECIMAL(9,6)
            ('crime_data', 'latitude', 'numeric'), #DECIMAL(9,6)
            ('crime_data', 'lsoa_id', 'character varying'), #VARCHAR
            ('crime_data', 'crime_type', 'character varying') #VARCHAR
        }
        
        table_column_name_set = {(r[0], r[1], r[2]) for r in all_columns}
    
        for table, col, dtype in expected_columns:
            if (table, col, dtype) in table_column_name_set:
                print(f" PASSED: {table}.{col} is {dtype}")
            else:
                print(f" FAILED: Type mismatch or missing column for {table}.{col} ")
        
        print("\n")
        print("\n---  ARE ALL KEY CONSTRAINTS CORRECT? ---")
        
        cur.execute(queries[2])
        constraints = cur.fetchall()
    
        #print(constraints)
        
        expected_keys = {
            ('display_zones', 'PRIMARY KEY', 'id'),
            ('statistical_areas', 'PRIMARY KEY', 'lsoa_id'),
            ('statistical_areas', 'FOREIGN KEY', 'display_zone_id'),
            ('postcodes', 'PRIMARY KEY', 'postcode'),
            ('postcodes', 'FOREIGN KEY', 'stat_area_id'),
            ('crime_data', 'PRIMARY KEY', 'id'),
            ('crime_data', 'FOREIGN KEY', 'lsoa_id')
        }
        
        actual_keys = {(r[0], r[2], r[3]) for r in constraints}

        for key in expected_keys:
            if key in actual_keys:
                print(f" PASSED: {key[1]} on {key[0]}({key[2]})")
            else:
                print(f" FAILED: Missing {key[1]} on {key[0]}({key[2]})! ")
        
        print("\n")
        print("---END OF SCHEMA VALIDATION REPORT---\n")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f" SCHEMA AUDIT ERROR: {e}")
        

if __name__ == "__main__":
    test_connection()
    schema_integrity_validation()