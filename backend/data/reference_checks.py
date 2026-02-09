from dotenv import load_dotenv
from error_logging import error_process
import pandas as pd
import os
from pathlib import Path

load_dotenv()

# find all CSVs that are in the data folder
def get_present_CSVs(dataPath):
    dataPath = Path(dataPath)
    folders = [folder for folder in os.listdir(dataPath) if os.path.isdir(dataPath / folder)]
    presentCSVs = []
    print(f"Fodlers in data path: {folders}")

    for folder in folders:
        CSVs = (dataPath / folder).glob("*.csv")
        for csv in CSVs:
            presentCSVs.append(csv)

    return presentCSVs


def check_references(data, checkAgainst, columnName):
    if columnName not in data.columns:
        print(f"Column {columnName} not found in data, skipping reference check for this column.")
        return []
    else:
        print("checking column: " + columnName)
        # print("===============================")
        dfSet = set(data[columnName].unique())
        checkAgainstSet = set(checkAgainst[columnName].unique())
        missingReferences = dfSet - checkAgainstSet
        return list(missingReferences)

def reference_check_process():
    # load the data and the reference tables
    dataPath = os.getenv("DATA_PATH_DEV")
    datasetPaths = get_present_CSVs(dataPath)
    # print(datasetPaths)
    # datasetPaths.remove(Path(dataPath + "/crime_data/crime_data.csv"))
    datasetPaths.remove(Path(dataPath + "/lsoas/lsoas.csv"))
    datasetPaths.remove(Path(dataPath + "/postcodes/postcodes.csv"))
    
    lsoas = pd.read_csv(dataPath + "/lsoas/lsoas.csv")
    postcodes = pd.read_csv(dataPath + "/postcodes/postcodes.csv")


    # check the references and log any errors
    for dataset in datasetPaths:
        print("Checking references for " + dataset.stem)
        data = pd.read_csv(dataset)
        missingReferences = check_references(data, lsoas, "lsoa_id")
        if missingReferences:
            error_process({
                "where": "reference_check_process -> LSOAs -> " + dataset.stem,
                "data": missingReferences,
                "desc": "There were references to LSOAs in the data that were not present in the cleansed LSOA CSV",
                "impact": "Data will not be able to be deleted, or will have missing values for the LSOA foreign key, leading to errors in ingestion",
                "cause": "LAD codes incorrect, missing LSOA codes in the raw LSOA data",
                "state" : "Data will be deleted with missing LSOA foreign key values, but will be marked as having reference errors in the error log"
            })
        
        missingReferences = check_references(data, postcodes, "postcode")
        if missingReferences:
            error_process({
                "where": "reference_check_process -> Postcodes -> " + dataset.stem,
                "data": missingReferences,
                "desc": "There were references to postcodes in the data that were not present in the cleansed postcode CSV",
                "impact": "Data will not be able to be deleted, or will have missing values for the postcode foreign key, leading to errors in ingestion",
                "cause": "Missing postcodes in raw CSV, missing postcodes in GeoJSON file",
                "state" : "Data will be deleted with missing postcode foreign key values, but will be marked as having reference errors in the error log"
            })
        print("================================")
    