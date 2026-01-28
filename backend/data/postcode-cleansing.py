from pathlib import Path
import pandas as pd
import geopandas as gpd
# import numpy as np

# list of postcodes in Kent from: https://www.postcode-info.co.uk/kent-postcodes-376.html
kentPostcodes = ["BR6", "BR8",
  "CT1", "CT10", "CT11", "CT12", "CT13", "CT14", "CT15", "CT16", "CT17", "CT18", "CT19",
  "CT2", "CT20", "CT21", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9",
  "DA1", "DA10", "DA11", "DA12", "DA13", "DA2", "DA3", "DA4", "DA9",
  "ME1", "ME10", "ME11", "ME12", "ME13", "ME14", "ME15", "ME16", "ME17", "ME18", "ME19",
  "ME2", "ME20", "ME3", "ME4", "ME5", "ME6", "ME7", "ME8", "ME9",
  "TN1", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN17", "TN18",
  "TN2", "TN23", "TN24", "TN25", "TN26", "TN27", "TN28", "TN29", "TN3", "TN30", "TN4", "TN8", "TN9"]


# get all CSVs in file path
def getFiles():
    filePath = Path(input("Please enter the path to the CSVs >> "))
    data = pd.DataFrame()
    for csv in filePath.glob("*.csv"):
        tempData = pd.read_csv(csv, usecols=[0, 41, 42, 50])
        data = pd.concat([data, tempData], ignore_index=True)
        #print(csv.name)
    return data

# remove duplicate rows
def removeDupes(data):
    return data.drop_duplicates()

# split postcodes into their areas, districts, and sectors 
def splitPostcodes(data):
    # based on data from: https://ideal-postcodes.co.uk/guides/uk-postcode-format
    postcodes = data['pcd']
    # if longer postcode, take an extra digit
    pcd_a = [] #e.g. CT
    pcd_d = [] # e.g. CT2/RH13
    pcd_s = [] # e.g. CT27/RH138
    for pcd in postcodes:
        spaceGone = pcd.replace(" ", "")
        pcd_a.append(spaceGone[:2]) # CT27QS - CT 
        if len(spaceGone) == 7: # RH138PA
            pcd_d.append(spaceGone[:4]) # RH13
            pcd_s.append(spaceGone[:5]) # RH138
        else:
            pcd_d.append(spaceGone[:3]) # CT2
            pcd_s.append(spaceGone[:4]) # CT27
    # print(f"pcd_a: {pcd_a}\npcd_d: {pcd_d}\npcd_s: {pcd_s}")
    data["pcd_a"] = pcd_a
    data["pcd_d"] = pcd_d
    data["pcd_s"] = pcd_s
    return data

# convert pd dataframe to geo dataframe - needs work
def toGeoDF(data):
    centroid = gpd.points_from_xy(data["long"], data["lat"])
    boundaries = gpd.GeoDataFrame()
    gdf = gpd.GeoDataFrame(data, geometry=boundaries, crs="EPSG:4326")
    gdf["centroid"] = centroid
    return gdf

# filter out all postcodes not in kent
def kentPostcodeFilter(data):
    inKent = data["pcd_d"].isin(kentPostcodes)
    return data.loc[inKent, :]

# reorder columns to match database
def formatPostcodeData(data):
    return data.loc[:, ["pcd", "lsoa", "pcd_a", "pcd_d", "pcd_s", "lat", "long", "geomet"]]


def main():
    data = getFiles()
    data.info()

    data = data.dropna()
    data = removeDupes(data)
    data = splitPostcodes(data)
    data = kentPostcodeFilter(data)
    # formatPostcodeData(data, ["postcode", "latitude", "longitude", ""])
    # data = toGeoDF(data)
    data.info()

    print(data.info())
    print(data.sample(n=30))

    # Quick testing
    # data = pd.DataFrame({"pcd": ["CT27QS", "RH138PA", "AA 26AB", "BH2 3GP"]})
    # data = splitPostcodes(data)
    # print(data.head(10))

if __name__ == "__main__":
    main()