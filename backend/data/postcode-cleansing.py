from pathlib import Path
import pandas as pd
import geopandas as gpd

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
def getFiles(filePath):
    data = gpd.read_file(filePath + r"\all_postcodes.csv")
    # for csv in filePath.glob("*.csv"):
    #     tempData = pd.read_csv(csv, usecols=[0, 41, 42, 50])
    #     data = pd.concat([data, tempData], ignore_index=True)
    
    return data


# remove duplicate rows
def removeDupes(data):
    return data.drop_duplicates()

# strips any spaces from a given column
def spaceStripColumn(data, column):
    data[column] = data[column].apply(lambda x: x.replace(" ", ""))
    return data

# split postcodes into their areas, districts, and sectors 
def splitPostcodes(data):
    # based on data from: https://ideal-postcodes.co.uk/guides/uk-postcode-format
    postcodes = data['pcd']
    
    pcd_a = [] #e.g. CT
    pcd_d = [] # e.g. CT2/RH13
    pcd_s = [] # e.g. CT27/RH138
    
    for pcd in postcodes:
        pcd_a.append(pcd[:2]) # CT27QS - CT 

        # dealing with the two types of postcode
        if len(pcd) == 7: # AA123BB
            pcd_d.append(pcd[:4]) # AA12
            pcd_s.append(pcd[:5]) # AA123
        else: # AA12BB
            pcd_d.append(pcd[:3]) # AA1
            pcd_s.append(pcd[:4]) # AA12
    data["pcd_a"] = pcd_a
    data["pcd_d"] = pcd_d
    data["pcd_s"] = pcd_s
    return data

# filter out all postcodes not in kent
def kentPostcodeFilter(data):
    inKent = data["pcd_d"].isin(kentPostcodes)
    return data.loc[inKent, :]

# reorder columns to match database
def reorganiseColumns(data):
    return data.loc[:, ["pcd", "lsoa21", "pcd_a", "pcd_d", "pcd_s", "lat", "long", "geometry", "centroid"]]

# generates a Point datatype holding the lat long centriod of the postcode
def generateCentroids(data):
    centroid = gpd.points_from_xy(data["long"], data["lat"])
    data["centroid"] = centroid
    return data

# using postcodes in kent, extract the polygon data from the geojson files
def extractPolygonData(data, geojsonPath):
    newData = []
    for pcdDist in data["pcd_d"].unique():
        print("new pc")
        current_file = gpd.read_file(geojsonPath + "/" + pcdDist + ".geojson")
        districtPcd = data[data["pcd_d"] == pcdDist] # all postcodes in that district
        for pcd in districtPcd["pcd"]:
            pcdData = current_file[current_file["mapit_code"] == pcd]
            newData.append(pcdData)

    return gpd.GeoDataFrame(pd.concat(newData, ignore_index=True))

# takes twewo DFs and inner joins them
def innerJoinDataframes(data, pcdData):
    return pd.merge(data, pcdData, left_on="pcd", right_on="mapit_code", how="inner")

# drops columns by a list of indexes (i)
def dropColumnsByIndex(data, i):
    return data.drop(data.columns[i], axis=1)

# export dataframe to a csv (data = the dataframe, path = file path, excluding filename)
def exportToCsv(data, path):
    data.to_csv(Path(path, "pcd_data.csv"), index=False)
    print("exported to " + path)

def renameColumn(data, colName, newName):
    return data.rename(columns={colName : newName})



def main():
    path = input("Please enter the path to the data >> ")
    data = getFiles(path)

    # remove irrelevant data
    data = data.dropna()
    data = removeDupes(data)

    print("removed dupes")
    # postcode processes
    data = spaceStripColumn(data, "pcd")
    data = splitPostcodes(data)
    data = kentPostcodeFilter(data)
    print("split postcodes")

    # centroid/polygon generation
    data = generateCentroids(data)
    pcdData = extractPolygonData(data, path)

    # final formatting
    data = innerJoinDataframes(data, pcdData)
    data = dropColumnsByIndex(data, [8, 9])
    # data = data.dropna() # these could be introduced from the join in combine datasets
    data = reorganiseColumns(data)
    data = renameColumn(data, "geometry", "boundary")

    exportLocation = input("please put in where you want to export your csv >> ")
    exportToCsv(data, exportLocation)


if __name__ == "__main__":
    main()