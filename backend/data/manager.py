# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from cleansing_scripts.lsoas_cleansing import lsoa_process
from cleansing_scripts.crime_cleansing import crime_process
from ingestion import initialise_db, ingest_table, get_rows
from pathlib import Path
from lsoa_issue_detection import lsoa_detection
from reference_checks import reference_check_process

# loads the path to the data folder from the .env
def load_data_path():
    load_dotenv()
    return os.getenv("DATA_PATH_DEV")

# find if there are any missing CSVs (where a folder is present, but has no CSV in it)
def check_missing_CSVs(dataPath):
    folders = os.listdir(dataPath) # only works if there are just folders for the database in there
    missingCSVs = []
    for folder in folders:
        # print(folder)
        CSVs = glob.glob(str(dataPath) + "/" + folder + "/*.csv")
        if CSVs == []:
            missingCSVs.append(folder)

    return missingCSVs

# takes a list of missing CSVs and runs the appropriate script to create them
def run_csv_creation(missingCsvFolders):
    if "lsoas" in missingCsvFolders:
        print("=====================================================")
        print("Creating LSOA CSV...")
        lsoa_process()
    if "postcodes" in missingCsvFolders:
        print("=====================================================")
        print("Creating Postcodes CSV...")
        postcodes_process()
    if "crime_data" in missingCsvFolders:
        print("=====================================================")
        print("Creating Crime Data CSV...")
        crime_process()
    if "school_data" in missingCsvFolders:
        print("=====================================================")
        print("Creating School Data CSV...")
        #schoolProcess()
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

# find all CSVs that are in the data folder
def get_present_CSVs(dataPath):
    dataPath = Path(dataPath)
    folders = [folder for folder in os.listdir(dataPath) if os.path.isdir(dataPath / folder)]
    presentCSVs = []

    for folder in folders:
        CSVs = (dataPath / folder).glob("*.csv")
        for csv in CSVs:
            presentCSVs.append(csv)

    return presentCSVs

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
        ingest_table(dataPath / csv, csv.stem)
        get_rows(5, csv.stem)


def main():
    dataPath = Path(load_data_path())
    # print("hello")
    # print(get_present_CSVs(dataPath))
    
    # check for missing CSVs
    missingCsvFolders = check_missing_CSVs(dataPath)
    print("=====================================================")
    print("Missing CSVs: " + str(missingCsvFolders))
    run_csv_creation(missingCsvFolders)

    # lsoa_detection()
    reference_check_process()

    ingest_check(dataPath)



if __name__ == "__main__":
    main()