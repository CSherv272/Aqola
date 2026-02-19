import os
import pandas as pd
from dotenv import load_dotenv
from pathlib import Path

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

# drop all rows with LSOA references that aren't in the cleansed LSOA CSV
def drop_row_if_no_reference_lsoa(data, lsoaData):
    lsoaSet = set(lsoaData["lsoa_id"].unique())
    data["lsoa_id"] = data["lsoa_id"].astype(str)
    data = data[data["lsoa_id"].isin(lsoaSet)]
    return data

# drop all rows with postcode references that aren't in the cleansed postcode CSV
def drop_row_if_no_reference_postcode(data, postcodesData):
    pcdSet = set(postcodesData["postcode"].unique())
    data["lsoa_id"] = data["lsoa_id"].astype(str)
    data = data[data["postcode"].isin(pcdSet)]
    return data

# iterates through all CSVs and drops rows with invalid LSOA or postcode references, based on cleansed lsoa and postcode CSVs
def drop_missing_references():
    load_dotenv()
    dataPath = os.getenv("DATA_PATH_DEV")

    lsoas = pd.read_csv(f"{dataPath}/lsoas/lsoas.csv")
    postcodes = pd.read_csv(f"{dataPath}/postcodes/postcodes.csv")

    lsoaSet = set(lsoas["lsoa_id"].astype(str))
    pcdSet = set(postcodes["postcode"].astype(str))

    print("=======================================================================")
    for csv in get_present_CSVs(dataPath):    
        print(f"{csv.stem}: Dropping all invalid LSOAs & postcodes...")
        df = pd.read_csv(csv)

        if "lsoa_id" in df.columns:
            df["lsoa_id"] = df["lsoa_id"].astype(str)
            df = df[df["lsoa_id"].isin(lsoaSet)]

        if "postcode" in df.columns:
            df["postcode"] = df["postcode"].astype(str)
            df = df[df["postcode"].isin(pcdSet)]

        df.to_csv(csv, index=False)