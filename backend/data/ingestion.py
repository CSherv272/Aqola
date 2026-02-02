from pathlib import Path
import pandas as pd
import geopandas as gpd
import logging
from sqlalchemy import create_engine, inspect, text

logger = logging.getLogger(__name__)
engine = create_engine ( "postgresql://aqola_user:mysecretpassword@localhost:5432/aqola")
with engine.connect() as conn:
    print("DB Connected")


def initialise_db():
    #G:\Files\Local Git\aqola\database\init\initialise.sql
    with engine.connect() as conn:
        with open("./database/init/initialise.sql") as sqlFile:
            query = text(sqlFile.read())
            conn.execute(query)
            conn.commit()

# assumes all data is correctly formatted
def ingest_table(filePath, tableName):
    inspector = inspect(engine)

    if tableName not in inspector.get_table_names():
        print(f"table doesn't exist {tableName}")
    else:
        try:
            data = gpd.read_file(filePath)
            data.to_sql(
                tableName,
                engine,
                if_exists="append",   # or replace if you really mean it
                index=False
            )
        except Exception as e:
            print(f"error: " + str(e))