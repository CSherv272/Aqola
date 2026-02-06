import pandas as pd
import os
import re
from pathlib import Path
from dotenv import load_dotenv


def get_school_info_data(schools_dir):
    # Loops through year folders and finds school info CSVs
    all_schools_list = []
    print(f"Scanning for school info in: {schools_dir}")

    for year_folder in schools_dir.iterdir():
        if year_folder.is_dir() and re.search(r"\d{4}-\d{4}", year_folder.name):
            year_range = year_folder.name 
            matches = list(year_folder.glob("*school_information.csv"))
            
            if matches:
                info_file = matches[0]
                print(f"  > Found School Info: {year_range} ({info_file.name})")
                df = pd.read_csv(info_file)
                df["year_range"] = year_range
                all_schools_list.append(df)
    
    return pd.concat(all_schools_list, ignore_index=True) if all_schools_list else pd.DataFrame()

def get_ofsted_data(ofsted_dir):
    # Loops through Ofsted folder and extracts data with academic year mapping.
    ofsted_list = []
    print(f"Scanning for Ofsted files in: {ofsted_dir}")

    for file in ofsted_dir.glob("*.csv"):
        match = re.search(r"(\d{4})", file.name)
        if match:
            snapshot_year = int(match.group(1))
            academic_year_range = f"{snapshot_year-1}-{snapshot_year}"
            
            df_ofsted = pd.read_csv(file, encoding="latin-1", low_memory=False)
            df_ofsted.columns = [c.strip() for c in df_ofsted.columns]
            
            if "URN" in df_ofsted.columns and "Overall effectiveness" in df_ofsted.columns:
                print(f"  > Found Ofsted: {academic_year_range}")
                temp = df_ofsted[["URN", "Overall effectiveness"]].copy()
                temp["year_range"] = academic_year_range
                ofsted_list.append(temp)
    
    return pd.concat(ofsted_list, ignore_index=True) if ofsted_list else pd.DataFrame()

def rename_and_clean_columns(df_schools, df_ofsted):
    # Renames columns for both dataframes and standardizes URNs.
    
    schools_renamed = df_schools.rename(columns={
        "URN": "urn",
        "SCHNAME": "school_name",
        "POSTCODE": "postcode",
        "ISPRIMARY": "is_primary",
        "ISSECONDARY": "is_secondary",
        "ISPOST16": "is_post16",
        "GENDER": "gender"
    })
    schools_renamed["urn"] = schools_renamed["urn"].astype(str).str.split('.').str[0].str.strip()

    ofsted_renamed = df_ofsted.rename(columns={
        "URN": "urn",
        "Overall effectiveness": "ofsted_ranking"
    })
    ofsted_renamed["urn"] = ofsted_renamed["urn"].astype(str).str.extract(r"(\d+)")

    return schools_renamed, ofsted_renamed

def merge_and_finalize(df_schools, df_ofsted):
    # Merges data and handles specific DB placeholder logic.
    final_df = df_schools.merge(df_ofsted, on=["urn", "year_range"], how="left")
    
    # Impute rankings
    final_df["ofsted_ranking"] = final_df["ofsted_ranking"].replace("Not Judged", 0)
    final_df["ofsted_ranking"] = pd.to_numeric(final_df["ofsted_ranking"], errors='coerce')
    
    # NOTE: Need to be extracted through postcode link
    final_df["lsoa_id"] = None
    final_df["centroid"] = None
    
    # Reorganize to match DB schema
    final_columns = [
        "urn",
        "lsoa_id",
        "school_name",
        "postcode", 
        "is_primary",
        "is_secondary",
        "is_post16", 
        "gender",
        "year_range",
        "ofsted_ranking",
        "centroid"
    ]
    return final_df.reindex(columns=final_columns)


def export_school_data(data, output_folder):
    # Exports finalised school data to output folder
    output_path = output_folder / "finalised_school_data.csv"
    data.to_csv(output_path, index=False)
    print(f"SUCCESS: {output_path}")
    print(f"Total Rows: {len(data)}")
    print(f"Years found: {data['year_range'].unique()}")


def school_process():
    load_dotenv()
    base_dir = Path(os.getenv("DATA_PATH_DEV"))
    
    schools_dir = base_dir / "raw" / "Kent_Schools_data"
    ofsted_dir = base_dir / "raw" / "Ofsted_rankings"

    raw_schools = get_school_info_data(schools_dir)
    raw_ofsted = get_ofsted_data(ofsted_dir)

    if raw_schools.empty:
        print("Error: No school data found.")
        return

    schools_clean, ofsted_clean = rename_and_clean_columns(raw_schools, raw_ofsted)
    final_data = merge_and_finalize(schools_clean, ofsted_clean)

    export_school_data(final_data, base_dir)

if __name__ == "__main__":
    school_process()