import pytest
import geopandas as gpd
import pandas as pd
from pathlib import Path

@pytest.fixture(scope="session")
def import_csv():
    filePath = input("Please enter file path to the produced csv >> ")
    gdf = gpd.read_file(filePath)
    return gdf

def test_check_nan_nulls(importCsv):
    assert(gpd.isnan(importCsv))

def test_check_dupes(importCsv):
    assert(gpd.duplicated(importCsv))

def test_postcode_filtering_for_kent(importCsv):
    allPostcodes = pd.read_csv(Path("C:/Users/Andrew Meyer/OneDrive - University of Kent/Files/Computer Science/Year 3 (25-26)/Project/Research/Raw Data Research/data/postcodes/all_postcodes.csv"))
    kentPostcodes = ["BR6", "BR8",
                    "CT1", "CT10", "CT11", "CT12", "CT13", "CT14", "CT15", "CT16", "CT17", "CT18", "CT19",
                    "CT2", "CT20", "CT21", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9",
                    "DA1", "DA10", "DA11", "DA12", "DA13", "DA2", "DA3", "DA4", "DA9",
                    "ME1", "ME10", "ME11", "ME12", "ME13", "ME14", "ME15", "ME16", "ME17", "ME18", "ME19",
                    "ME2", "ME20", "ME3", "ME4", "ME5", "ME6", "ME7", "ME8", "ME9",
                    "TN1", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN17", "TN18",
                    "TN2", "TN23", "TN24", "TN25", "TN26", "TN27", "TN28", "TN29", "TN3", "TN30", "TN4", "TN8", "TN9"]
    
    kentPcds = allPostcodes.filter(like=[kentPostcodes], axis=0)
    assert kentPcds["pcd"].isin(importCsv["pcd"])