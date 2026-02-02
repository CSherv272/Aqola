import sys
from pathlib import Path
import geopandas as gpd
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geometry, WKTElement

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'aqola',
    'user': 'aqola_user',
    'password': 'mysecretpassword'
}

TARGET_CRS = "EPSG:4326"   # WGS84 (lat/long)
KENT_LAD_CODES = [
    'E07000105', 'E07000106', 'E07000107', 'E07000108',
    'E07000112', 'E07000109', 'E07000110', 'E06000035',
    'E07000111', 'E07000113', 'E07000114', 'E07000115',
    'E07000116',
]


def create_db_connection():
    connection_string = (
        f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@"
        f"{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    )
    return create_engine(connection_string)

def read_and_transform_lsoa_data(file_path: Path) -> gpd.GeoDataFrame:
    """
    Reads LSOA shapefile and transforms it to WGS84 (the standard geographic coordinate system).

    Args:
        file_path (Path): Path to the LSOA shapefile.

    Returns:
        GeoDataFrame with transformed geometries.
    """
    print("Reading and transforming LSOA data...")

    gdf = gpd.read_file(file_path)

    print("Found {len(gdf)} LSOA areas")
    print("Original CRS:", gdf.crs)
    print(f"Columns: {gdf.columns.tolist()}")

    if gdf.crs != TARGET_CRS:
        gdf = gdf.to_crs(TARGET_CRS)
        print("Transformed CRS to:", TARGET_CRS)

    return gdf


def prepare_data_for_db(gdf, pop_df_path: Path = None):
    """Prepare GeoDataFrame for database insertion."""
    
    print ("Preparing data for database insert.")

    lsoas = []

    pop_df = pd.read_csv(pop_df_path)

    for idx, row in gdf.iterrows():
        lsoa_id = row.get('LSOA21CD', None)
        lad_code = pop_df.loc[pop_df["LSOA 2021 Code"] == lsoa_id, "LAD 2023 Code"].values[0] if lsoa_id in pop_df["LSOA 2021 Code"].values else None
        if lad_code not in KENT_LAD_CODES:
            continue

        centroid = row.geometry.centroid

        area_sq_km = row.get('Shape_Area', row.geometry.area) / 1e6

        population = pop_df.loc[pop_df["LSOA 2021 Code"] == lsoa_id, "Total"].values[0] if lsoa_id in pop_df["LSOA 2021 Code"].values else None

        lsoa = {
            'lsoa_id': lsoa_id,
            'area_name': row.get('LSOA21NM', None),
            'population': int(population.replace("," , "")) if population is not None else None,
            'area_sq_km': area_sq_km,
            'centroid': WKTElement(centroid.wkt, srid=4326),
            'geometry': WKTElement(row.geometry.wkt, srid=4326)
        }

        lsoas.append(lsoa)
    
    lsoa_count = len(lsoas)

    return lsoas, lsoa_count

def make_csv_from_json(lsoas, output_path: Path):
    """Utility function to create a CSV from LSOA data for inspection."""
    df = pd.DataFrame(lsoas)
    df.to_csv(output_path, index=False)
    print(f"CSV written to {output_path}")


def insert_lsoas_to_db(engine, lsoas):
    """Ingesting LSOAs into the database."""

    print("Inserting LSOAs into database...")
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        insert_sql = text("""
            INSERT INTO lsoas 
            (lsoa_id, area_name, population, area_sq_km, boundary, centroid)
            VALUES 
            (:lsoa_id, :area_name, :population, :area_sq_km,
              ST_GeomFromText(:geometry, 4326), ST_GeomFromText(:centroid, 4326))
            ON CONFLICT (lsoa_id)
            DO UPDATE SET
                area_name = EXCLUDED.area_name,
                population = EXCLUDED.population,
                area_sq_km = EXCLUDED.area_sq_km,
                boundary = EXCLUDED.boundary,
                centroid = EXCLUDED.centroid
        """)

        for lsoa in lsoas:
            lsoa['geometry'] = str(lsoa['geometry'].data)
            lsoa['centroid'] = str(lsoa['centroid'].data)

        session.execute(insert_sql, lsoas)
        print(f"Inserted/Updated {len(lsoas)} LSOAs successfully.")
        session.commit()

    except Exception as e:
        print(f"Error preparing insert statement: {e}")
        session.close()
        return
    
    finally:
        session.close()

    print("LSOAs inserted successfully.")

def validate_import(engine, lsoa_count):
    """Validate the data imported"""
    print("Validating imported data...")

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        result = session.execute(text("SELECT COUNT(*) FROM lsoas;"))
        count = result.scalar()
        print(f"Total LSOAs in database: {count}")
        assert count == lsoa_count, f"Expected {lsoa_count} LSOAs, found {count} in database."

    except Exception as e:
        print(f"Error validating import: {e}")

    finally:
        session.close()

def main():
    """Execute database connection."""
    
    shapefile_path = None

    if len(sys.argv) < 3:
        print("Usage: python lsoa.py <path_to_lsoa_shapefile> <path_to_population_csv>")
        sys.exit(1)

    else:
        shapefile_path = Path(sys.argv[1])
        pop_df_path = Path(sys.argv[2])

    # shapefile_path = Path(sys.argv[1])
    if not shapefile_path.exists():
        print(f"Shapefile not found at: {shapefile_path}")
        sys.exit(1)

    if not pop_df_path.exists():
        print(f"Population CSV not found at: {pop_df_path}")
        sys.exit(1)

    try:
        
        gdf = read_and_transform_lsoa_data(
            shapefile_path
        )

        engine = create_db_connection()
        Session = sessionmaker(bind=engine)
        session = Session()
        print("Database connection established successfully.")

        lsoas, count = prepare_data_for_db(gdf, pop_df_path)

        # print("Writing LSOA data to CSV for inspection...")

        # make_csv_from_json(lsoas, Path(r"C:\Users\Callum\Downloads\lsoas_kent.csv"))


        print(f"Prepared {len(lsoas)} LSOAs for database insertion.")

        insert_lsoas_to_db(engine, lsoas)

        validate_import(engine, count)

    except Exception as e:
        print(f"Error -> : {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()