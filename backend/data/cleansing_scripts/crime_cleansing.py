import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
import os

# get crime data
def get_crime_data():
    data = pd.DataFrame()
    tempPath = Path(str(os.getenv("DATA_PATH_DEV")) + r"crime_data\raw")

    # find all CSVs in crime_data folder
    for csv in tempPath.glob("*.csv"):    
        data = pd.concat([data, pd.read_csv(csv)], ignore_index=True)

    return data

# removes all uneeded columns, returns a dataframe
# keeps columns : Month, Longitude, Latitude, LSOA code, Crime Type
def column_selection(data):
    colIndex = [1, 4, 5, 7, 9]
    colKeep = data.columns[colIndex]
    data = data[colKeep]
    return data


# exports dataframe to a CSV, if there is already a file it asks if developer wants to overwrite
def export_to_csv(data, path):
    data.to_csv(Path(path, "crime_data\crime_data.csv"), index=False)


# adds "-01" to make the dates a valid format (YYYY-MM-dd)
def format_dates(data):
    data["date"] = data["date"].astype(str) + "-01"
    return data

# renames columns from raw crime data labels, to match the database
def rename_columns(data):
    columns = {
        "Month" : "date",
        "Longitude" : "longitude",
        "Latitude" : "latitude",
        "LSOA code" : "lsoa_id",
        "Crime type" : "crime_type"
    }

    return data.rename(columns=columns)


# columns are returned in the order the database expects them
def reorganise_columns(data):
    return data.reindex(columns=["lsoa_id", "date", "latitude", "longitude", "crime_type"])


def crime_process():
    load_dotenv()
    data = get_crime_data()

    # format csv
    data = column_selection(data)
    data = rename_columns(data)
    data = reorganise_columns(data)
    data = data.dropna()
    data = format_dates(data)

    #export
    export_to_csv(data, str(os.getenv("DATA_PATH_DEV")))