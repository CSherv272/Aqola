# from pathlib import Path
from dotenv import load_dotenv
import os
import glob
from cleansing_scripts.postcodes_cleansing import postcodes_process
from ingestion import initialise_db, ingest_table

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
        #lsoaProcess()
    if "postcodes" in missingCsvFolders:
        print("Creating Postcodes CSV")
        postcodes_process()
    if "crime_data" in missingCsvFolders:
        print("Creating Crime Data CSV")
        #crimeProcess()
    if "school_data" in missingCsvFolders:
        print("Creating School Data CSV")
        #schoolProcess()
    if "flood_data" in missingCsvFolders:
        print("Creating Flood Data CSV")
        #floodProcess()

def ingest_check(dataPath):
    folders = os.listdir(dataPath) # only works if there are just folders for the database in there
    presentCSVs = []

    for folder in folders:
        # print(folder)
        presentCSVs.append(glob.glob(dataPath + "/" + folder + "/*.csv"))
    
    # all data depends on lsoa table
    if "lsoas.csv" not in  presentCSVs:
        raise Exception("Cannot ingest data without LSOA table. All other tables are dependant on LSOAs")
    # all data depends on postcodes - except lsoas
    # len statement excludes lsoa ONLY ingestion case
    elif "postcodes.csv" not in presentCSVs and len(presentCSVs) > 1: 
        raise Exception("Cannot ingest data without postcodes table. All other tables are dependant on LSOAs")
    else:
        run_ingest(presentCSVs, dataPath)

def run_ingest(ingestCSVs, dataPath):
    initialise_db()
    
    ingest_table(dataPath + "lsoas.csv", "lsoas")
    ingest_table(dataPath + "postcodes.csv", "postcodes")

    for csv in ingestCSVs:
        ingest_table(dataPath + csv, csv.replace(".csv", ""))


def main():
    dataPath = load_path()
    # print(path)
    missingCsvFolders = check_missing_CSVs(dataPath)
    print("Missing CSVs: " + str(missingCsvFolders))
    run_csv_creation(missingCsvFolders)



if __name__ == "__main__":
    main()