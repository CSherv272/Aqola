import pandas as pd
from dotenv import load_dotenv
import os
from pathlib import Path
from cleansing_scripts.lsoas_cleansing import lsoa_process
from pandas import DataFrame

# find all CSVs that are in the data folder
def get_present_CSVs(dataPath: Path):
    presentCSVs = []
    for folder in dataPath.iterdir():
        if folder.is_dir():
            presentCSVs.extend(folder.glob("*.csv"))
    return presentCSVs

# check the raw LSOA data for LSOA values, against the given data (will be each CSV data)
# returns all LSOAs in the dataset and NOT in the lsoa raw data
def check_raw_lsoa_file(data: DataFrame, basePath: Path):
    rawLsoaPath = basePath / "lsoas/raw/LSOA_population.csv"
    rawLsoa = pd.read_csv(rawLsoaPath)

    uniqueLsoaRaw = set(rawLsoa["LSOA 2021 Code"].unique())
    uniqueLsoaData = set(data["lsoa_id"].unique())

    return list(uniqueLsoaData - uniqueLsoaRaw)

# check the cleansed LSOA data for LSOA values, against the given data (will be each CSV data)
# returns all LSOAs in the dataset and NOT in the lsoa cleansed data
def check_cleansed_lsoa_file(data: DataFrame, basePath: Path):
    cleansedPath = basePath / "lsoas/lsoas.csv"
    cleansedLsoa = pd.read_csv(cleansedPath)

    uniqueLsoaCleansed = set(cleansedLsoa["lsoa_id"].unique())
    uniqueLsoaData = set(data["lsoa_id"].unique())

    return list(uniqueLsoaData - uniqueLsoaCleansed)

# find the LAD for each missing LSOA - this is used by teh LSOA CSV creation script
def find_missing_lads(onlyInRaw, basePath):
    rawLsoaPath = basePath / "lsoas/raw/LSOA_population.csv"
    rawLsoa = pd.read_csv(rawLsoaPath)

    ladVals = rawLsoa.loc[rawLsoa["LSOA 2021 Code"].isin(onlyInRaw), "LAD 2023 Code"]
    
    return list(ladVals)

# pass the additional required LADs into the LSOA CSV creation script
def add_lsoas_via_lad(lads):
    lsoa_process(lads)

# add a default row in the LSOA CSV (values are fillers)
# this is for references with no LSOA in the lsoa data, to use as foreign key
def add_default_val_to_lsoa(basePath):
    cleansedLsoa = pd.read_csv(basePath / "lsoas/lsoas.csv")

    data = {
        "lsoa_id" : "DEFAULT",
        "area_name" : "DEFAULT",
        "population" : 0,
        "area_sq_km" : 0,
        "boundary" : "POLYGON ((-0.138457945713944 51.636525373477944, -0.1346085347747556 51.63377526866537, -0.1359035635153366 51.63338586756, -0.1423914179272028 51.63480339687829, -0.1483576363727426 51.637123342872066, -0.1423210560064236 51.63931278410187, -0.138457945713944 51.636525373477944))",
        "centroid" : "POINT (-0.1415010650251589 51.63628759965568)"
    }

    if "DEFAULT" not in cleansedLsoa["lsoa_id"].values:
        print("=====================================================")
        print("Adding Default...")
        cleansedLsoa.loc[len(cleansedLsoa)] = data
        cleansedLsoa.to_csv(basePath / "lsoas/lsoas.csv", index=False)

# check each file to see if it has missing LSOAs and run the fix
def process_each_file(basePath: Path):
    filePaths = get_present_CSVs(basePath)
    requiredLads = []

    print("=====================================================")
    print("Prechecks:")
    for filePath in filePaths:
        fileLoaded = pd.read_csv(filePath)
        notInRaw = check_raw_lsoa_file(fileLoaded, basePath)
        notInCleansed = check_cleansed_lsoa_file(fileLoaded, basePath)

        # if in raw but not in cleansed
        onlyInRaw = set(notInCleansed) - set(notInRaw)
        onlyInRaw = list(onlyInRaw)
        lads = find_missing_lads(onlyInRaw, basePath)

        requiredLads.extend(lads)
        requiredLads = list(set(requiredLads))
        print("---------------------------------------------")
        print(f"\nFile: {filePath.name}")
        # print(f"Not in cleansed: {notInCleansed}")
        print(f"Not in raw: {notInRaw}")
        print(f"Only in Raw: {onlyInRaw}")

        # if not in raw or in cleansed - set default (put this at the end)
        # need to make sure that premade default values are skipped
        if notInRaw and Path(filePath).stem != "lsoas":
            print("=====================================================")
            print(f"replacing values with default in {Path(filePath).stem}")
            print("=====================================================")
            replace_missing_lsoas_as_default(fileLoaded, notInRaw, filePath)


    
    if requiredLads != []:
        add_lsoas_via_lad(requiredLads)
    
    print("=====================================================")
    print("final checks:")
    # final checks
    for filePath in filePaths:
        fileLoaded = pd.read_csv(filePath)
        # notInRaw = check_raw_lsoa_file(fileLoaded, basePath)
        notInCleansed = check_cleansed_lsoa_file(fileLoaded, basePath)
        notInRaw = check_raw_lsoa_file(fileLoaded, basePath)
        onlyInRaw = set(notInCleansed) - set(notInRaw)
        print("---------------------------------------------")
        print(f"\nFile: {filePath.name}")
        print(f"Not in cleansed: {notInCleansed}")
        print(f"Not in raw: {notInRaw}")
        print(f"Only in Raw: {onlyInRaw}")

# in the CSV with LSOA references missing in the whole LSOA dataset, set these to "DEFAULT"
def replace_missing_lsoas_as_default(data, missingLsoas, dataPath):
    if "DEFAULT" in missingLsoas:
        missingLsoas.remove("DEFAULT")
    
    data.loc[data["lsoa_id"].isin(missingLsoas), "lsoa_id"] = "DEFAULT"
    data.to_csv(dataPath, index=False)


def lsoa_detection():
    load_dotenv()
    basePath = Path(os.getenv("DATA_PATH_DEV"))

    process_each_file(basePath)
    add_default_val_to_lsoa(basePath)

# lsoa_detection()