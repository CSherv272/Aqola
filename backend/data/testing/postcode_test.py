import pytest
import geopandas as gpd
import pandas as pd
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

KENT_POSTCODE_DISTRICTS = [
    "BR6", "BR8",
    "CT1", "CT10", "CT11", "CT12", "CT13", "CT14", "CT15", "CT16", "CT17", "CT18", "CT19",
    "CT2", "CT20", "CT21", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9",
    "DA1", "DA10", "DA11", "DA12", "DA13", "DA2", "DA3", "DA4", "DA9",
    "ME1", "ME10", "ME11", "ME12", "ME13", "ME14", "ME15", "ME16", "ME17", "ME18", "ME19",
    "ME2", "ME20", "ME3", "ME4", "ME5", "ME6", "ME7", "ME8", "ME9",
    "TN1", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN17", "TN18",
    "TN2", "TN23", "TN24", "TN25", "TN26", "TN27", "TN28", "TN29", "TN3", "TN30", "TN4", "TN8", "TN9"
]


@pytest.fixture(scope="session")
def postcodes_csv():
    return pd.read_csv(Path(os.getenv("DATA_PATH_DEV")) / "postcodes/postcodes.csv")


@pytest.fixture(scope="session")
def all_postcodes_csv():
    return pd.read_csv(Path(os.getenv("DATA_PATH_DEV")) / "postcodes/raw/all_postcodes.csv", usecols=[0, 41, 42, 50])


def test_check_nan_nulls(postcodes_csv):
    assert not postcodes_csv.isna().any().any(), "CSV contains NaN/null values"


def test_check_dupes(postcodes_csv):
    assert not postcodes_csv.duplicated().any(), "CSV contains duplicate rows"


def test_postcode_filtering_for_kent(postcodes_csv):
    produced_districts = set(
        postcodes_csv["postcode_district"].str.strip().str.extract(r'^([A-Z]+\d+)')[0].dropna()
    )
    unexpected = produced_districts - set(KENT_POSTCODE_DISTRICTS)
    missing = set(KENT_POSTCODE_DISTRICTS) - produced_districts

    assert not unexpected, f"Unexpected districts found: {unexpected}"
    assert not missing, f"Expected districts not found: {missing}"