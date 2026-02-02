# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from cleansing_scripts.lsoas_cleansing import lsoa_process
from cleansing_scripts.crime_cleansing import crime_cleansing
from ingestion import initialise_db, ingest_table, get_rows
from pathlib import Path
import pandas as pd
import numpy as np

def load_path():
    load_dotenv()
    return os.getenv("DATA_PATH_DEV")

def check_missing_CSVs(dataPath):
    folders = os.listdir(dataPath) # only works if there are just folders for the database in there
    missingCSVs = []
    for folder in folders:
        # print(folder)
        CSVs = glob.glob(dataPath + "/" + folder + "/*.csv")
        if CSVs == []:
            missingCSVs.append(folder)

    return missingCSVs

def run_csv_creation(missingCsvFolders):
    if "lsoas" in missingCsvFolders:
        print("Creating LSOA CSV")
        lsoa_process()
    if "postcodes" in missingCsvFolders:
        print("Creating Postcodes CSV")
        postcodes_process()
    if "crime_data" in missingCsvFolders:
        print("Creating Crime Data CSV")
        crime_cleansing()
    if "school_data" in missingCsvFolders:
        print("Creating School Data CSV")
        #schoolProcess()
    if "flood_data" in missingCsvFolders:
        print("Creating Flood Data CSV")
        #floodProcess()

def ingest_check(dataPath):
    dataPath = Path(dataPath)
    folders = os.listdir(dataPath)
    presentCSVs = []

    for folder in folders:
        CSVs = (dataPath / folder).glob("*.csv")
        for csv in CSVs:
            presentCSVs.append(csv)

    print(presentCSVs)

    if (dataPath / "lsoas" / "lsoas.csv") not in presentCSVs:
        raise Exception("Cannot ingest data without LSOA table.")
    elif (dataPath / "postcodes" / "postcodes.csv") not in presentCSVs and len(presentCSVs) > 1:
        raise Exception("Cannot ingest data without postcodes table.")
    else:
        run_ingest(presentCSVs, dataPath)


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

    for table in csv.stem:
        get_rows(5, table)


def lsoa_postcode_overlap_check(dataPath):
    dataPath = Path(dataPath)
    
    # Load tables
    lsoas = pd.read_csv(dataPath / "lsoas/lsoas.csv")
    pcds = pd.read_csv(dataPath / "postcodes/postcodes.csv")

    # Unique LSOA IDs
    lsoa_ids = set(lsoas['lsoa_id'].unique())
    pcds_ids = set(pcds['lsoa_id'].unique())

    # Find mismatches
    only_in_lsoas = lsoa_ids - pcds_ids
    only_in_pcds = pcds_ids - lsoa_ids

    # Postcodes referencing LSOAs missing from postcodes table
    if only_in_lsoas:
        print("LSOAs missing from postcodes:")
        for lsoa in only_in_lsoas:
            # Find all postcodes that reference this LSOA
            postcodes = pcds.loc[pcds['lsoa_id'] == lsoa, 'postcode'].tolist()
            print(f"LSOA {lsoa}: postcodes -> {postcodes if postcodes else 'None'}")

    # Postcodes with LSOAs not in LSOA table
    if only_in_pcds:
        print("Postcodes referencing unknown LSOAs:")
        for lsoa in only_in_pcds:
            postcodes = pcds.loc[pcds['lsoa_id'] == lsoa, 'postcode'].tolist()
            print(f"LSOA {lsoa}: postcodes -> {postcodes}")

    if not only_in_lsoas and not only_in_pcds:
        print("Perfect match: LSOAs and postcodes align")

def main():
    dataPath = load_path()
    lsoa_postcode_overlap_check(dataPath)
    # missingCsvFolders = check_missing_CSVs(dataPath)
    # print("Missing CSVs: " + str(missingCsvFolders))
    # run_csv_creation(missingCsvFolders)
    # ingest_check(dataPath)



if __name__ == "__main__":
    main()