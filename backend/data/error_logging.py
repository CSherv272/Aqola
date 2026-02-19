import pandas as pd
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv()

def add_error_to_logs(data):
    path = os.getenv("DATA_PATH_DEV")
    # os.remove(Path(path) / "error_log.csv")
    log_path = Path(path) / "error_log.csv"

    # print(f"error log path {log_path}")
    if log_path.is_file():
        # print(f"Adding error to log file...")
        data.to_csv(log_path, index=False, mode="a", header=False)
    else:
        # print(f"Creating log file: {log_path}\nAnd appending errors...")
        data.to_csv(log_path, index=False, header=True)

def format_error(d):
    df = pd.DataFrame(
    {
        "time": pd.Timestamp.now(),
        "where": d.get("where"),
        "data": d.get("data"),
        "desc": d.get("desc"),
        "impact": d.get("impact"),
        "cause": d.get("cause"),
        "state" : d.get("state", "unresolved")
    })
    return df

def error_process(d):
    df = format_error(d)
    add_error_to_logs(df)

# d = {
#     "data": [1, 2, 3],
#     "where": "aaaa",
#     "desc": "bbbb",
#     "impact": "big",
#     "cause": "ehh"
# }

# df = format_error(d)
# add_error_to_logs(df)
