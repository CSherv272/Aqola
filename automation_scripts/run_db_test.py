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
                print(f" Table '{table}' found. ✅ PASSED")
            else:
                print(f" Table '{table}' is missing from database. ❌ FAILED")
        
        print("\n---  IS THE POSTGIS EXTENSION PRESENT? ---")
        # Verify PostGIS is active
        if 'spatial_ref_sys' in found_tables:
            print(" PostGIS extension confirmed. ✅ PASSED")
        else:
            print(" PostGIS extension missing. ❌ FAILED")
        
        
        print("\n")
        print("\n---  ARE ALL NECESSARY COLUMNS/ DATA TYPES/ NULL CONSTRAINTS IN THE TABLES PRESENT? ---")
        cur.execute(queries[1])
        all_columns = cur.fetchall()
        expected_columns = {
            ('display_zones', 'id', 'integer', 'NO'),                # SERIAL
            ('display_zones', 'name', 'character varying', 'NO'),    # VARCHAR(100)
            ('display_zones', 'zone_code', 'character varying', 'NO'), # VARCHAR(20)
            ('display_zones', 'population', 'integer', 'YES'),       # INT (Nullable)
            ('display_zones', 'area_sq_km', 'numeric', 'YES'),       # DECIMAL(10,2) (Nullable)
            ('display_zones', 'boundary', 'USER-DEFINED', 'NO'),      # GEOMETRY(MULTIPOLYGON, 4326)
            ('display_zones', 'centroid', 'USER-DEFINED', 'NO'),      # GEOMETRY(POINT, 4326)

            ('statistical_areas', 'lsoa_id', 'character varying', 'NO'),       # VARCHAR(20)
            ('statistical_areas', 'display_zone_id', 'integer', 'NO'),        # INT (Foreign Key)
            ('statistical_areas', 'area_name', 'character varying', 'NO'),    # VARCHAR(100)
            ('statistical_areas', 'population', 'integer', 'YES'),            # INT (Nullable)
            ('statistical_areas', 'area_sq_km', 'numeric', 'YES'),            # DECIMAL(10,4) (Nullable)
            ('statistical_areas', 'boundary', 'USER-DEFINED', 'NO'),           # GEOMETRY(MULTIPOLYGON, 4326)
            ('statistical_areas', 'centroid', 'USER-DEFINED', 'NO'),           # GEOMETRY(POINT, 4326)

            ('postcodes', 'postcode', 'character varying', 'NO'),             # VARCHAR(10)
            ('postcodes', 'stat_area_id', 'character varying', 'NO'),         # VARCHAR(20) (Foreign Key)
            ('postcodes', 'postcode_area', 'character varying', 'NO'),        # VARCHAR(4)
            ('postcodes', 'postcode_district', 'character varying', 'NO'),    # VARCHAR(4)
            ('postcodes', 'postcode_sector', 'character varying', 'NO'),      # VARCHAR(5)
            ('postcodes', 'latitude', 'numeric', 'NO'),                       # DECIMAL(9,6)
            ('postcodes', 'longitude', 'numeric', 'NO'),                      # DECIMAL(9,6)
            ('postcodes', 'location', 'USER-DEFINED', 'NO'),                  # GEOMETRY(POINT, 4326)

            ('crime_data', 'id', 'integer', 'NO'),                            # SERIAL
            ('crime_data', 'lsoa_id', 'character varying', 'NO'),             # VARCHAR(20) (Foreign Key)
            ('crime_data', 'date', 'date', 'NO'),                             # DATE
            ('crime_data', 'latitude', 'numeric', 'NO'),                      # DECIMAL(9,6)
            ('crime_data', 'longitude', 'numeric', 'NO'),                     # DECIMAL(9,6)
            ('crime_data', 'crime_type', 'character varying', 'NO')
        }
        
        filtered_columns = {(r[0], r[1], r[2], r[3]) for r in all_columns}
        
        print(f"{'TABLE.COLUMN':<35} | {'DATA TYPE':<20} | {'NULLABLE':<10}")
        print("-" * 70)

        # Sort them so they group by table automatically
        for table, col, dtype, null_status in sorted(expected_columns):
            target = f"{table}.{col}"
            if (table, col, dtype, null_status) in filtered_columns:
                print(f"{target:<35} | {dtype:<20} | {null_status:<10} ✅ PASSED")
            else:
                print(f"{target:<35} | {dtype:<20} | {null_status:<10} ❌ FAILED")

        print("-" * 70)
                
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

        print("-" * 60)

        # expected_keys contains (table, type, column)
        for table, k_type, col in sorted(expected_keys):
            if (table, k_type, col) in actual_keys:
                print(f"{table:<20} | {k_type:<15} | {col:<20} ✅ PASSED")
            else:
                print(f"{table:<20} | {k_type:<15} | ERROR: {col:<13} ❌ FAILED")
        
        print("\n")
        print("---END OF SCHEMA VALIDATION REPORT---\n")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f" SCHEMA AUDIT ERROR: {e}")
        

if __name__ == "__main__":
    test_connection()
    schema_integrity_validation()