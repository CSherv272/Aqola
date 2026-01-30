

import subprocess
import sys
from pathlib import Path
import pandas as pd
import geopandas as gpd
import geopandas as gpd
import os
import logging
logger = logging.getLogger(__name__)


from sqlalchemy import create_engine, inspect, text

FilePath = Path(r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data")
engine = create_engine ( "postgresql://aqola_user:mysecretpassword@localhost:5432/aqola")
with engine.connect() as conn:
    print("DB Connected")


def getData(name):
    data = pd.DataFrame()
    #for csv in FilePath.append(name).glob("*.csv"):
    tempPath = Path
    tempPath = FilePath / name
    tempData = []
    for csv in tempPath.glob("*.csv"):
        tempData.append(pd.read_csv(csv))
        #print(csv)
    
    data = pd.concat(tempData, ignore_index=True)
    return data

def orderCollumns(df, table):
    dbColumnSet = set({c["name"].lower() for c in inspector.get_columns(table)})

    autoMap = {c: c.lower() for c in df.columns if c.lower() in dbColumnSet}
    manualMap = getTableDict(table)
    if manualMap == {}:
        return()
    
    #apply automap and manualmap, with manual taking prio
    columnMap = {**autoMap, **manualMap}

    missing = set(columnMap.values()) - dbColumnSet
    if missing :
        print("columns not added: %s" , missing)

    validKeys = [c for c in columnMap if c in df.columns]
    print("valid keys used are:", validKeys)
    input()
    return df[validKeys].rename(columns = columnMap)


def getTableDict(name):
    match name : 
        case "crime_data" :
            return {"type": "crime_type",
            "lsoa_id": "lsoa code",
            "date": "Month"}
        case _:
            return {}
        
                


def columnChoice(data):
    print("Total column headers are: ")
    print(data.columns.values)

    for i, col in enumerate(data.columns):
        print(f"{i}: {col}")

    #colIndex = input ("Enter column numbers to keep (comma sepparated): ")
    colIndex = "1, 4, 5, 7, 9"
    colIndex =  [int(i.strip()) for i in colIndex.split(",")]
    colKeep = data.columns[colIndex]
    data = data[colKeep]

    print (data.columns.values)
    return data 

def cleanNull(data):
    data = data.dropna()
    return data

def nameFileExport(df):
    fileName = input("Input filename: ")
    export_to_csv(df, fileName)

def export_to_csv(df, filename):
    path = "./resources/data/"
    overwrite = "y"

    # CSV file extension check
    if ".csv" not in filename:
        filename = filename + ".csv"

    # Check CSV doesn't already exist
    existing = list(Path(path).glob("*.csv"))
    if Path(path + filename) in existing:
        print("file already exists")
        overwrite = input("Do you wish to overwrite it (y/n) >>  ").lower()

    if overwrite == "y":
        df.to_csv(Path(path + filename))
        print(f"Data exported as {filename}")
    else:
        print("Data not exported")

def old():
    data = columnChoice(data)
    data = cleanNull(data)
    nameFileExport(data)



    data.to_sql(
        "crime_data",
        engine,
        if_exists="replace",
        index = False
    )

def initialiseDB():
    #G:\Files\Local Git\aqola\database\init\initialise.sql
    with engine.connect() as conn:
        with open(Path(r"G:\Files\Local Git\aqola\database\init\initialise.sql")) as sqlFile:
            query = text(sqlFile.read())
            conn.execute(query)
            conn.commit()

# assumes all data is correctly formatted
def ingestTable(filePath, tableName):
    inspector = inspect(engine)

    if tableName not in inspector.get_table_names():
        print(f"table doesn't exist {tableName}")
    else:
        try:
            data = gpd.read_file(filePath)
            data.to_sql(
                tableName,
                engine,
                if_exists="append",   # or replace if you really mean it
                index=False
            )
        except Exception as e:
            print(f"error: " + str(e))

def main():
    # postcodesFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\postcodes"
    lsoaFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\lsoas\lsoas_kent.csv"
    # crimeFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\crime_data"

    # initialiseDB()
    # ingestTable(postcodesFilePath, "postcodes")
    ingestTable(lsoaFilePath, "lsoas")
    # ingestTable(crimeFilePath, "crime_data")



    data.to_sql(
        "crime_data",
        engine,
        if_exists="replace",
        index = False
    )

def initialiseDB():
    #G:\Files\Local Git\aqola\database\init\initialise.sql
    with engine.connect() as conn:
        with open(Path(r"G:\Files\Local Git\aqola\database\init\initialise.sql")) as sqlFile:
            query = text(sqlFile.read())
            conn.execute(query)
            conn.commit()

# assumes all data is correctly formatted
def ingestTable(filePath, tableName):
    inspector = inspect(engine)

    if tableName not in inspector.get_table_names():
        print(f"table doesn't exist {tableName}")
    else:
        try:
            data = gpd.read_file(filePath)
            data.to_sql(
                tableName,
                engine,
                if_exists="append",   # or replace if you really mean it
                index=False
            )
        except Exception as e:
            print(f"error: " + str(e))

def main():
    # postcodesFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\postcodes"
    lsoaFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\lsoas\lsoas_kent.csv"
    # crimeFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\crime_data"

    # initialiseDB()
    # ingestTable(postcodesFilePath, "postcodes")
    ingestTable(lsoaFilePath, "lsoas")
    # ingestTable(crimeFilePath, "crime_data")



    data.to_sql(
        "crime_data",
        engine,
        if_exists="replace",
        index = False
    )

def initialiseDB():
    #G:\Files\Local Git\aqola\database\init\initialise.sql
    with engine.connect() as conn:
        with open(Path(r"G:\Files\Local Git\aqola\database\init\initialise.sql")) as sqlFile:
            query = text(sqlFile.read())
            conn.execute(query)
            conn.commit()

# assumes all data is correctly formatted
def ingestTable(filePath, tableName):
    inspector = inspect(engine)

    if tableName not in inspector.get_table_names():
        print(f"table doesn't exist {tableName}")
    else:
        try:
            data = gpd.read_file(filePath)
            data.to_sql(
                tableName,
                engine,
                if_exists="append",   # or replace if you really mean it
                index=False
            )
        except Exception as e:
            print(f"error: " + str(e))

def main():
    # postcodesFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\postcodes"
    lsoaFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\lsoas\lsoas_kent.csv"
    # crimeFilePath = r"C:\Users\Andrew Meyer\OneDrive - University of Kent\Files\Computer Science\Year 3 (25-26)\Project\Research\Raw Data Research\data\crime_data"

    # initialiseDB()
    # ingestTable(postcodesFilePath, "postcodes")
    ingestTable(lsoaFilePath, "lsoas")
    # ingestTable(crimeFilePath, "crime_data")


if __name__ == "__main__":
    main()

