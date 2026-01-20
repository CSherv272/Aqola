

import subprocess
import sys
from pathlib import Path
import pandas as pd


##subprocess.run( [sys.executable, "-m", "pip", "install", "-r", "reqs.txt"], check = True )


CrimeFilePath = Path(r"C:\Users\mjp\OneDrive - University of Kent\Andrew Meyer's files - Project\Research\Raw Data Research\Crime\Kent_police_crime_data")
data = pd.DataFrame()
for csv in CrimeFilePath.glob("*.csv"):
    tempData = pd.read_csv(csv)
    data = pd.concat([data, tempData], ignore_index=True)
    #print(csv.name)

def columnChoice(data):
    print("Total column headers are: ")
    print(data.columns.values)

    for i, col in enumerate(data.columns):
        print(f"{i}: {col}")

    colIndex = input ("Enter column numbers to keep (comma sepparated): ")
    #colIndex = "1, 4, 5, 6, 7, 9"
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


data = columnChoice(data)
data = cleanNull(data)
nameFileExport(data)





