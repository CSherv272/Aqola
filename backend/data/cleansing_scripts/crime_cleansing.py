import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

def getData():
    data = pd.DataFrame()
    # tempPath = Path
    tempPath = Path(str(os.getenv("DATA_PATH_DEV")) + r"crime_data\raw")
    print(tempPath)
    # tempData = []
    for csv in tempPath.glob("*.csv"):
        # tempData.append(pd.read_csv(csv))
        #print(csv)
    
        data = pd.concat([data, pd.read_csv(csv)], ignore_index=True)
    
    return data

def column_selection(data):
    colIndex = [1, 4, 5, 7, 9]
    colKeep = data.columns[colIndex]
    data = data[colKeep]
    return data

def export_to_csv(data, path):
    if os.path.isfile(Path(path) / "crime_data\crime_data.csv"):
        overwrite = input("would you like to overwrite the current file? >> ").lower()
        if overwrite == "y" or overwrite == "yes":
            data.to_csv(Path(path, "crime_data\crime_data.csv"), index=False)
            print("overwritten file at: " + path + "crime_data")
        else:
            print("file not overwritten")
    else:
        data.to_csv(Path(path, "crime_data\crime_data.csv"), index=False)
        print("exported to " + path + "crime_data")

def rename_columns(data):
    columns = {
        "Month" : "date",
        "Longitude" : "longitude",
        "Latitude" : "latitude",
        "LSOA code" : "lsoa_id",
        "Crime type" : "crime_type"
    }

    return data.rename(columns=columns)

def reorganise_columns(data):
    return data.reindex(columns=["lsoa_id", "date", "latitude", "longitude", "crime_type"])


def crime_cleansing():
    data = getData()

    # format csv
    data = column_selection(data)
    data = rename_columns(data)
    # print(data.sample(10))
    data = reorganise_columns(data)
    # print(data.sample(10))
    data = data.dropna()

    #export
    export_to_csv(data, str(os.getenv("DATA_PATH_DEV")))