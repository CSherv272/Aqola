import sys
import os
from dotenv import load_dotenv
from pathlib import Path

import geopandas as gpd
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geometry, WKTElement

load_dotenv()

DB_CONFIG = {
    'host' : 'localhost',
    'port' : 5432,
    'database': 'aqola',
    'user': 'aqola_user',
    'password': 'mysecretpassword'
}

kentPostcodes = ["BR6", "BR8",
  "CT1", "CT10", "CT11", "CT12", "CT13", "CT14", "CT15", "CT16", "CT17", "CT18", "CT19",
  "CT2", "CT20", "CT21", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9",
  "DA1", "DA10", "DA11", "DA12", "DA13", "DA2", "DA3", "DA4", "DA9",
  "ME1", "ME10", "ME11", "ME12", "ME13", "ME14", "ME15", "ME16", "ME17", "ME18", "ME19",
  "ME2", "ME20", "ME3", "ME4", "ME5", "ME6", "ME7", "ME8", "ME9",
  "TN1", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN17", "TN18",
  "TN2", "TN23", "TN24", "TN25", "TN26", "TN27", "TN28", "TN29", "TN3", "TN30", "TN4", "TN8", "TN9"
  ]

def create_db_connection():
    connection_string = (
        f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@"
        f"{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    )
    return create_engine(connection_string)


def find_output_file_path(env_var: str):
    """Find the output path to place the processed CSV"""
    # We will have varying priorities of where we can find these file paths

    # 1st priority: ENV file
    env_path = Path(env_var + "/flood_data/", "flood_data.csv")
    if env_path is not None:
        return env_path

    print("output env variable not found, using backup")
    # Fallback
    fallback = Path(__file__).parent / ".output"
    fallback.mkdir(exist_ok=True)
    return fallback / "flood_data.csv"

def find_input_file_path(env_var: str):
    """Find the input path to create the processed CSV"""

    # 1st priority: ENV file
    env_path = Path(env_var + "/flood_data/raw/")
    if env_path is not None and env_path.exists():
        return env_path
    
    print("input env variable not found, using backup")
    # Fallback
    fallback = Path(__file__).parent / ".input"
    if fallback.exists():
        return env_path
    else:
        print("Error! no input")

def find_file_paths():

    # Looks for DATA_PATH_DEV in the .env file
    env_var = os.environ.get("DATA_PATH_DEV")

    output = find_output_file_path(env_var)
    input = find_input_file_path(env_var)
    postcode_df_path = Path(env_var + "/postcodes/postcodes.csv")
    
    return input, output, postcode_df_path

def find_existing_postcodes(postcode: str, postcode_df):
    try:
        valid_postcode_list = postcode_df[postcode_df["postcode"].str.contains(postcode[0:-1])]
        return valid_postcode_list.postcode.to_list()
    
    except Exception as e:
        print(f"Failed when searching postcodes. -> {e}")
        return



def prepare_data_for_db(flood_df, postcode_df):
    
    flood_data_rows = []
    
    engine = create_db_connection()

    for idx, row in flood_df.iterrows():

        postcode = row.get("PC", None)
        
        if postcode.split(" ")[0] not in kentPostcodes:
            continue
        
        postcode = postcode.replace(" ", "")

        if postcode[-1] != "*":
            if postcode_df["postcode"].isin([postcode]).any():
                frs_count_high = int(row.get("TOT_CNT_High"))
                frs_count_medium = int(row.get("TOT_CNT_Medium"))
                frs_count_low = int(row.get("TOT_CNT_Low"))
                frs_count_very_low = int(row.get("TOT_CNT_VeryLow"))
                
                frs_band = "High"
                frs_band_count = frs_count_high 

                for frs_count in [frs_count_medium, frs_count_low, frs_count_very_low]:
                    if frs_count > frs_band_count:
                        if frs_count == frs_count_medium:
                            frs_band = "Medium"
                        if frs_count == frs_count_low:
                            frs_band = "Low"
                        if frs_count == frs_count_very_low:
                            frs_band = "Very_Low"
                        frs_band_count = frs_count

                flood_row = {
                    'postcode' : postcode.replace(" ", ""),
                    'frs_band' : frs_band,
                    'frs_count_high': frs_count_high,
                    'frs_count_medium': frs_count_medium,
                    'frs_count_low': frs_count_low,
                    'frs_count_very_low': frs_count_very_low,
                }

                flood_data_rows.append(flood_row)
            else:
                print(f"Postcode: {postcode} is missing from the cleansed postcode csv when trying to add from Flood Data. Skipping.")
        else:
            valid_postcodes = find_existing_postcodes(postcode, postcode_df)
            for valid_postcode in valid_postcodes:
                if not flood_df["PC"].str.replace(" ", "").isin([valid_postcode]).any():
                    flood_row = {
                        'postcode' : valid_postcode.replace(" ", ""),
                        'frs_band' : "None",
                        'frs_count_high': 0,
                        'frs_count_medium': 0,
                        'frs_count_low': 0,
                        'frs_count_very_low': 0,
                    }

                    flood_data_rows.append(flood_row) 

    # Clean all accidentally duplicated rows
    
    return flood_data_rows

def make_csv_from_json(flood_rows, output_path: Path):
    """Utility function to create a CSV from Flood data for inspection."""
    df = pd.DataFrame(flood_rows)
    df.to_csv(output_path, index=False)
    print(f"CSV written to {output_path}")

def flood_process():

    INPUT_PATH, OUTPUT_PATH, POSTCODE_PATH = find_file_paths()
    # rofrs = Risk of Flooding from Rivers and Seas
    rofrs_filepath = INPUT_PATH / "RoFRS_PostcodesAtRisk_v202501.csv"
    try:
        flood_df = pd.read_csv(rofrs_filepath)
        

        postcodes_df = pd.read_csv(POSTCODE_PATH)

        flood_data_rows = prepare_data_for_db(flood_df, postcodes_df)
        make_csv_from_json(flood_data_rows, OUTPUT_PATH)
    
    except Exception as e:
        print(f"Error -> : {e}")
        sys.exit(1)

if __name__ == "__main__":
    flood_process()