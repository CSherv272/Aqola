from pathlib import Path
from dotenv import load_dotenv
import os

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

def loadPath():
    load_dotenv()
    devPath = os.getenv("DATA_PATH_DEV")
    

def main():
    path = loadPath()
    print(path)

if __name__ == "__main__":
    main()