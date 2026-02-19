# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from cleansing_scripts.lsoas_cleansing import lsoa_process
from cleansing_scripts.crime_cleansing import crime_process
from cleansing_scripts.school_cleansing import school_process
from ingestion import initialise_db, ingest_table, get_rows
from pathlib import Path
from reference_checks import reference_check_process
from cleansing_scripts.data_cleansing import drop_missing_references, get_present_CSVs
import pandas as pd

load_dotenv()

# find if there are any missing CSVs (where a folder is present, but has no CSV in it)
def check_missing_CSVs(dataPath):
    folders = os.listdir(dataPath) # only works if there are just folders for the database in there
    print(f"Folders: " + str(folders))
    missingCSVs = []
    for folder in folders:
        # print(folder)
        CSVs = glob.glob(str(dataPath) + "/" + folder + "/*.csv")
        if CSVs == []:
            missingCSVs.append(folder)

    return missingCSVs

# takes a list of missing CSVs and runs the appropriate script to create them
def run_csv_creation(missingCSVs):
    if "lsoas" in missingCSVs:
        print("=====================================================")
        print("Creating LSOA CSV...")
        lsoa_process()
    if "postcodes" in missingCSVs:
        print("=====================================================")
        print("Creating Postcodes CSV...")
        postcodes_process()
    if "crime_data" in missingCSVs:
        print("=====================================================")
        print("Creating Crime Data CSV...")
        crime_process()
    if "school_data" in missingCSVs:
        print("=====================================================")
        print("Creating School Data CSV...")
        school_process()
    if "flood_data" in missingCsvFolders:
        print("=====================================================")
        print("Creating Flood Data CSV...")
        #floodProcess()

# ensures that the LSOA CSV is present, and if there's more than one to be ingest, that both the LSOA and postcodes table are there
def ingest_check(dataPath):
    presentCSVs = get_present_CSVs(dataPath)

    if (Path(dataPath / "lsoas/lsoas.csv")) not in presentCSVs:
        raise Exception("Cannot ingest data without LSOA table.")
    elif (Path(dataPath / "postcodes/postcodes.csv")) not in presentCSVs and len(presentCSVs) > 1:
        raise Exception("Cannot ingest data without postcodes table.")
    else:
        run_ingest(presentCSVs, dataPath)



# ingest LSOAs, then Postcodes, then everything else
# calls ingestion.py functions: ingest_table, get_rows, initialise_db
def run_ingest(ingestCSVs, dataPath):
    # setup database
    initialise_db()

    # # ingest LSOAs
    ingest_table(dataPath / "lsoas" / "lsoas.csv", "lsoas")
    ingestCSVs.remove(dataPath / "lsoas" / "lsoas.csv")
    print("=====================================================")
    print(f"Ingesting lsoa data...")
    get_rows(5, "lsoas")

    # # then ingest postcodes
    ingest_table(dataPath / "postcodes" / "postcodes.csv", "postcodes")
    ingestCSVs.remove(dataPath / "postcodes" / "postcodes.csv")
    print("=====================================================")
    print(f"Ingesting postcode data...")
    get_rows(5, "postcodes")


    # then ingest everything else
    for csv in ingestCSVs:
        print("=====================================================")
        print(f"Ingesting {csv.stem} data...")
        
        if csv.stem == "school_data":
            df = pd.read_csv(csv)
            # Convert 'DEFAULT' to None so it becomes a valid SQL NULL
            df['lsoa_id'] = df['lsoa_id'].replace('DEFAULT', None)
            df.to_csv(csv, index=False) # Overwrite before ingestion
        ingest_table(dataPath / csv, csv.stem)
        get_rows(5, csv.stem)


def main():
    dataPath = Path(os.getenv("DATA_PATH_DEV"))
    # print("hello")
    # print(get_present_CSVs(dataPath))
    
    # check for missing CSVs
    missingCsvFolders = check_missing_CSVs(dataPath)
    print("=====================================================")
    print("Missing CSVs: " + str(missingCsvFolders))
    run_csv_creation(missingCsvFolders)

    # lsoa_detection()
    reference_check_process()
    drop_missing_references() # drops rows with invalid LSOA or postcode refs

    # ingest_check(dataPath)



if __name__ == "__main__":
    main()