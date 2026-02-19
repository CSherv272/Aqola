from dotenv import load_dotenv
from error_logging import error_process
import pandas as pd
import os
from pathlib import Path
from cleansing_scripts.data_cleansing import get_present_CSVs

load_dotenv()

def check_references(data, checkAgainst, columnNameData : str, columnNameCheckAgainst : str):
    if columnNameData not in data.columns:
        # print("=======================================================================")
        # print(f"     Column {columnNameData} not found in data, skipping reference check for this column.")
        return []
    
    if columnNameCheckAgainst not in checkAgainst:
        # print("=======================================================================")
        # print(f"     Column {columnNameCheckAgainst} not found in reference data.")
        return []
    
    else:
        # print(f"     checking column: {columnNameData}\n     against: {columnNameCheckAgainst}")
        # print("===============================")
        dfSet = set(data[columnNameData]
            .astype(str)
            .str.replace(" ", "")
            .unique())
        checkAgainstSet = set(checkAgainst[columnNameCheckAgainst]
            .astype(str)
            .str.replace(" ", "")
            .unique())
        
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
    postcodesCleansed = pd.read_csv(dataPath + "/postcodes/postcodes.csv")
    postcodesRaw = pd.read_csv(dataPath + "/postcodes/raw/all_postcodes.csv", usecols=["pcd"])


    # check the references and log any errors
    print("=======================================================================")
    anyMissing = []
    for dataset in datasetPaths:
        data = pd.read_csv(dataset)
        # print("=======================================================================")
        print(f"Checking references for {dataset.stem}")
        missingLsoaInRaw = check_references(data, lsoasRaw, "lsoa_id", "LSOA 2021 Code")
        # print("=======================================================================")
        # print(f"Checking LSOA references for {dataset.stem}, against cleansed CSV")
        missingLsoaInCleansed = check_references(data, lsoasCleansed, "lsoa_id", "lsoa_id")

        # if it's missing from the raw files
        if missingLsoaInRaw:
            error_process({
                "where": "reference_check_process -> checking LSOAs -> " + dataset.stem + ".csv",
                "data": missingLsoaInRaw,
                "desc": "There were references to LSOAs in the data that were not present in the raw LSOA files",
                "impact": "Data will be dropped from cleansed CSV and not ingested",
                "cause": "Missing LSOA codes in the raw LSOA data",
                "state" : "for review"
            })

        # if it's only missing from the cleansed files
        elif missingLsoaInCleansed:
            error_process({
                "where": "reference_check_process -> checking LSOAs -> " + dataset.stem,
                "data": missingLsoaInCleansed,
                "desc": "There were references to LSOAs in the data that were not present in the cleansed LSOA CSV",
                "impact": "Data will be deleted, or will have missing values for the LSOA foreign key, leading to errors in ingestion",
                "cause": "LAD codes incorrect",
                "state" : "for review"
            })
        

        # if missing in postcodes dataset
        # print("=======================================================================")
        # print(f"Checking postcode references for {dataset.stem}, against raw data")

        missingPcInRaw = check_references(data, postcodesRaw, "postcode", "pcd")
        # print("=======================================================================")
        # print(f"Checking postcode references for {dataset.stem}, against cleansed CSV")

        missingPcInCleansed = check_references(data, postcodesCleansed, "postcode", "postcode")

        # if it's missing from the raw files
        if missingPcInRaw:
            error_process({
                "where": "reference_check_process -> checking Postcodes -> " + dataset.stem,
                "data": missingPcInRaw,
                "desc": "There were references to postcodes in the data that were not present in the raw postcode CSV (all_postcodes.csv)",
                "impact": "Data will not be able to be deleted, or will have missing values for the postcode foreign key, leading to errors in ingestion",
                "cause": "Missing postcodes in raw CSV",
                "state" : "for review"
            })
        # if it's only missing from the cleansed files
        elif missingPcInCleansed:
            error_process({
                "where": "reference_check_process -> checking Postcodes -> " + dataset.stem,
                "data": missingPcInCleansed,
                "desc": "There were references to postcodes in the data that were not present in the cleansed postcode CSV",
                "impact": "Data will not be able to be deleted, or will have missing values for the postcode foreign key, leading to errors in ingestion",
                "cause": "Missing postcodes in cleansed CSV, missing postcodes in GeoJSON file",
                "state" : "for review"
            })

        #user feedback
        anyMissing = list(set(missingLsoaInCleansed + missingLsoaInRaw + missingPcInCleansed + missingPcInRaw + anyMissing))
    if anyMissing:
        print("-----------------------------------------------------------------------")
        print(f"Missing values: {anyMissing}\nPlease see error log")
    else:
        print("-----------------------------------------------------------------------")
        print("No missing references found")
