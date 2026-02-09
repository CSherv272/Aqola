from pathlib import Path
import pandas as pd
import geopandas as gpd
import os.path
from dotenv import load_dotenv
from error_logging import error_process

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
def get_postcode_data(filePath):
    data = pd.read_csv(Path(filePath) / "postcodes/raw/all_postcodes.csv", usecols=[0, 41, 42, 50])
    return data

# remove duplicate rows
def remove_dupes(data):
    return data.drop_duplicates()

# strips any spaces from a given column
def space_strip_column(data, column):
    data[column] = data[column].apply(lambda x: x.replace(" ", ""))
    return data

# split postcodes into their areas, districts, and sectors 
def split_postcodes(data):
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
def kent_postcode_filter(data):
    inKent = data["pcd_d"].isin(kentPostcodes)
    return data.loc[inKent, :]

# reorder columns to match database
def reorganise_columns(data):
    return data.loc[:, ["pcd", "lsoa21", "pcd_a", "pcd_d", "pcd_s", "lat", "long", "geometry", "centroid"]]

# generates a Point datatype holding the lat long centriod of the postcode
def generate_centroids(data):
    centroid = gpd.points_from_xy(data["long"], data["lat"])
    data["centroid"] = centroid
    return data

# using postcodes in kent, extract the polygon data from the geojson files
def extract_polygon_data(data, geojsonPath):
    newData = []
    errDataGeo = { 
        "data": [],
        "where" : "extract_polygon_data",
        "desc" : "postcode in geojson, but not in cleansed CSV",
        "impact" : "skipped, due to foriegn key issues",
        "cause" : "missing data for postcode in the all_postcodes CSV"

    }
    errDataRaw = { 
        "data": [],
        "where" : "extract_polygon_data",
        "desc" : "postcode in raw postcodes CSV, but not in GeoJSON files",
        "impact" : "skipped, unable to represent on the map",
        "cause" : "missing data for postcode in the GeoJSON files"

    }
    onlyInGeo = set()
    # onlyInRaw = set()

    for pcdDist in kentPostcodes: # data["pcd_d"].unique()
        file_path = Path(geojsonPath) / "postcodes/raw" / f"{pcdDist}.geojson"
        if not file_path.exists():
            continue

        current_file = gpd.read_file(file_path)
        districtPcd = data[data["pcd_d"] == pcdDist]
        
        # all the postcodes in that geojson that are also in the dataframe
        for pcd in districtPcd["pcd"]:
            pcdData = current_file[current_file["mapit_code"] == pcd]
            newData.append(pcdData)

#===========================================================================================#
        # ERROR CHECKING - find missing postcodes between geojson and all_postcodes
        onlyInGeo = set(list(set(current_file["mapit_code"].unique()) - set(districtPcd["pcd"].unique())) + list(onlyInGeo))
        # onlyInRaw = set(list(set(districtPcd["pcd"].unique()) - set(current_file["mapit_code"].unique())) + list(onlyInRaw))
        
    #process errors
    errDataGeo["data"] = list(onlyInGeo)
    # errDataRaw["data"] = list(onlyInRaw)
    error_process(errDataGeo)
    error_process(errDataRaw)
#===========================================================================================#

    return gpd.GeoDataFrame(pd.concat(newData, ignore_index=True))

# takes twewo DFs and inner joins them
def inner_join_dataframes(data, pcdData):
    return pd.merge(data, pcdData, left_on="pcd", right_on="mapit_code", how="inner")

# drops columns by a list of indexes (i)
def drop_columns_by_index(data, i):
    return data.drop(data.columns[i], axis=1)

# renames columns from raw postcode data labels, to match the database
def rename_columns(data):
    columns = {
        "pcd" : "postcode",
        "lsoa21" : "lsoa_id",
        "pcd_a" : "postcode_area",
        "pcd_d" : "postcode_district",
        "pcd_s" : "postcode_sector",
        "lat" : "latitude",
        "long" : "longitude",
        "geometry" : "boundary"
    }

    return data.rename(columns=columns)

# export dataframe to a csv (data = the dataframe, path = file path, excluding filename)
def export_to_csv(data, path):
    if os.path.isfile(Path(path) / "postcodes/postcodes.csv"):
        overwrite = input("would you like to overwrite the current file? >> ").lower()
        if overwrite == "y" or overwrite == "yes":
            data.to_csv(Path(path, "postcodes/postcodes.csv"), index=False)
            print("overwritten file at: " + path + "postcodes/raw/")
        else:
            print("file not overwritten")
    else:
        data.to_csv(Path(path, "postcodes\postcodes.csv"), index=False)
        print("exported to " + path + "postcodes\raw")


def postcodes_process():
    load_dotenv()
    path = os.getenv("DATA_PATH_DEV")
    data = get_postcode_data(path)

    # remove irrelevant data
    data = data.dropna()
    data = remove_dupes(data)

    # postcode processes
    data = space_strip_column(data, "pcd")
    data = split_postcodes(data)
    data = kent_postcode_filter(data)

    # centroid/polygon generation
    data = generate_centroids(data)
    pcdData = extract_polygon_data(data, path)

    # final formatting
    data = inner_join_dataframes(data, pcdData)
    data = drop_columns_by_index(data, [8, 9])
    data = reorganise_columns(data)
    data = rename_columns(data)

    export_to_csv(data, path)


# if __name__ == "__main__":
#     main()