# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from cleansing_scripts.lsoas_cleansing import lsoa_process
from cleansing_scripts.crime_cleansing import crime_cleansing
from ingestion import initialise_db, ingest_table
from pathlib import Path

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
    # initialise_db()

    # # ingest LSOAs
    ingest_table(dataPath / "lsoas" / "lsoas.csv", "lsoas")
    ingestCSVs.remove(dataPath / "lsoas" / "lsoas.csv")

    # # then ingest postcodes
    ingest_table(dataPath / "postcodes" / "postcodes.csv", "postcodes")
    ingestCSVs.remove(dataPath / "postcodes" / "postcodes.csv")

    # then ingest everything else
    for csv in ingestCSVs:
        ingest_table(dataPath / csv, csv.stem)


def main():
    dataPath = load_path()
    missingCsvFolders = check_missing_CSVs(dataPath)
    print("Missing CSVs: " + str(missingCsvFolders))
    run_csv_creation(missingCsvFolders)
    ingest_check(dataPath)



if __name__ == "__main__":
    main()