from dotenv import load_dotenv
from error_logging import error_process
import pandas as pd
import os
from pathlib import Path
from cleansing_scripts.data_cleansing import get_present_CSVs

load_dotenv()

def check_references(data, checkAgainst, columnNameData, columnNameCheckAgainst : str = "lsoa_id"):
    if columnNameData not in data.columns:
        print(f"Column {columnNameData} not found in data, skipping reference check for this column.")
        return []
    else:
        print("checking column: " + columnNameData)
        # print("===============================")
        dfSet = set(data[columnNameData].unique())
        checkAgainstSet = set(checkAgainst[columnNameCheckAgainst].unique())
        missingReferences = dfSet - checkAgainstSet
        return list(missingReferences)

def reference_check_process():
    # load the data and the reference tables
    dataPath = os.getenv("DATA_PATH_DEV")
    datasetPaths = get_present_CSVs(dataPath)
    # print(datasetPaths)
    # datasetPaths.remove(Path(dataPath + "/crime_data/crime_data.csv"))
    # datasetPaths.remove(Path(dataPath + "/lsoas/lsoas.csv"))
    # datasetPaths.remove(Path(dataPath + "/postcodes/postcodes.csv"))
    
    lsoasCleansed = pd.read_csv(dataPath + "/lsoas/lsoas.csv")
    lsoasRaw = pd.read_csv(dataPath + "/lsoas/raw/LSOA_population.csv")
    postcodes = pd.read_csv(dataPath + "/postcodes/postcodes.csv")


    # check the references and log any errors
    for dataset in datasetPaths:
        print("Checking references for " + dataset.stem)
        data = pd.read_csv(dataset)

        
        missingInRaw = check_references(data, lsoasRaw, "lsoa_id", "LSOA 2021 Code")
        missingInCleansed = check_references(data, lsoasCleansed, "lsoa_id")

        # check in the raw LSOA CSV
        if missingInRaw:
            error_process({
                "where": "reference_check_process -> checking LSOAs -> " + dataset.stem,
                "data": missingInRaw,
                "desc": "There were references to LSOAs in the data that were not present in the cleansed LSOA CSV",
                "impact": "Data will be deleted, or will have missing values for the LSOA foreign key, leading to errors in ingestion",
                "cause": "Missing LSOA codes in the raw LSOA data",
                "state" : "Data will be deleted with missing LSOA foreign key values, but will be marked as having reference errors in the error log"
            })

        # check in the cleansed LSOA CSV
        elif missingInCleansed:
            error_process({
                "where": "reference_check_process -> checking LSOAs -> " + dataset.stem,
                "data": missingInCleansed,
                "desc": "There were references to LSOAs in the data that were not present in the cleansed LSOA CSV",
                "impact": "Data will be deleted, or will have missing values for the LSOA foreign key, leading to errors in ingestion",
                "cause": "LAD codes incorrect",
                "state" : "Data will be deleted with missing LSOA foreign key values, but will be marked as having reference errors in the error log"
            })
        
        missingReferences = check_references(data, postcodes, "postcode")
        if missingReferences:
            error_process({
                "where": "reference_check_process -> checking Postcodes -> " + dataset.stem,
                "data": missingReferences,
                "desc": "There were references to postcodes in the data that were not present in the cleansed postcode CSV",
                "impact": "Data will not be able to be deleted, or will have missing values for the postcode foreign key, leading to errors in ingestion",
                "cause": "Missing postcodes in raw CSV, missing postcodes in GeoJSON file",
                "state" : "Data will be deleted with missing postcode foreign key values, but will be marked as having reference errors in the error log"
            })
        print("================================")
    