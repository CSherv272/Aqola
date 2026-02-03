# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from cleansing_scripts.lsoas_cleansing import lsoa_process
from cleansing_scripts.crime_cleansing import crime_cleansing
from ingestion import initialise_db, ingest_table, get_rows
from pathlib import Path
from lsoa_issue_detection import lsoa_detection
# import pandas as pd
# import numpy as np

def load_path():
    load_dotenv()
    return os.getenv("DATA_PATH_DEV")

def check_missing_CSVs(dataPath):
    folders = os.listdir(dataPath) # only works if there are just folders for the database in there
    missingCSVs = []
    for folder in folders:
        # print(folder)
        CSVs = glob.glob(str(dataPath) + "/" + folder + "/*.csv")
        if CSVs == []:
            missingCSVs.append(folder)

    return missingCSVs

def run_csv_creation(missingCsvFolders):
    if "lsoas" in missingCsvFolders:
        print("Creating LSOA CSV...")
        print("=========================================================")
        lsoa_process()
    if "postcodes" in missingCsvFolders:
        print("Creating Postcodes CSV...")
        print("=========================================================")
        postcodes_process()
    if "crime_data" in missingCsvFolders:
        print("Creating Crime Data CSV...")
        print("=========================================================")
        crime_cleansing()
    if "school_data" in missingCsvFolders:
        print("Creating School Data CSV...")
        print("=========================================================")
        #schoolProcess()
    if "flood_data" in missingCsvFolders:
        print("Creating Flood Data CSV...")
        print("=========================================================")
        #floodProcess()

def ingest_check(dataPath):
    presentCSVs = get_present_CSVs(dataPath)

    if (Path(dataPath / "lsoas/lsoas.csv")) not in presentCSVs:
        raise Exception("Cannot ingest data without LSOA table.")
    elif (Path(dataPath / "postcodes/postcodes.csv")) not in presentCSVs and len(presentCSVs) > 1:
        raise Exception("Cannot ingest data without postcodes table.")
    else:
        run_ingest(presentCSVs, dataPath)

def get_present_CSVs(dataPath):
    dataPath = Path(dataPath)
    folders = os.listdir(dataPath)
    presentCSVs = []

    for folder in folders:
        CSVs = (dataPath / folder).glob("*.csv")
        for csv in CSVs:
            presentCSVs.append(csv)

    return presentCSVs

def run_ingest(ingestCSVs, dataPath):
    # setup database
    initialise_db()

    # # ingest LSOAs
    ingest_table(dataPath / "lsoas" / "lsoas.csv", "lsoas")
    ingestCSVs.remove(dataPath / "lsoas" / "lsoas.csv")

    # # then ingest postcodes
    ingest_table(dataPath / "postcodes" / "postcodes.csv", "postcodes")
    ingestCSVs.remove(dataPath / "postcodes" / "postcodes.csv")

    # then ingest everything else
    for csv in ingestCSVs:
        ingest_table(dataPath / csv, csv.stem)

    for table in ingestCSVs:
        get_rows(5, table.stem)


def main():
    dataPath = Path(load_path())
    # print("hello")
    # print(get_present_CSVs(dataPath))
    
    # check for missing CSVs
    missingCsvFolders = check_missing_CSVs(dataPath)
    print("Missing CSVs: " + str(missingCsvFolders))
    run_csv_creation(missingCsvFolders)

    lsoa_detection()

    ingest_check(dataPath)



if __name__ == "__main__":
    main()