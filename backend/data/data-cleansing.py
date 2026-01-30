

import subprocess
import sys
from pathlib import Path
import pandas as pd
import os
import logging
logger = logging.getLogger(__name__)


from sqlalchemy import create_engine, inspect

FilePath = Path(r"C:\Users\mjp\OneDrive - University of Kent\Andrew Meyer's files - Project\Research\Raw Data Research\data")
engine = create_engine ( "postgresql://aqola_user:mysecretpassword@localhost:5432/aqola")
with engine.connect() as conn:
    print("DB Connected")
inspector = inspect(engine)


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
    return df[validKeys].rename(columns = columnMap)


def getTableDict(name):
    match name : 
        case "crime_data" :
            print("inside case")
            return {"crime_type": "Crime type",
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

def main():
    fileList = os.listdir(FilePath)
    fileSet = {f.lower() for f in fileList}

    

    tables = inspector.get_table_names()
    print(tables)
    print(fileSet)

    for i in tables:    
        if i.lower() in fileSet:
            tempData = pd.DataFrame()
            tempData = getData(i)
            print(i)
            print(tempData)
            cleanNull(tempData)
            tempData = orderCollumns(tempData, i)
            if tempData.shape[0] == 0:
                tempData.to_sql(
                    i, engine, if_exists="replace"
                )
            
    # stmnt ='SELECT * FROM aqola'
    # print(conn.execute(stmnt))
    print (pd.read_sql('SELECT * FROM crime_data', engine))


if __name__ == "__main__":
    main()

