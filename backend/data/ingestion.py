from sqlalchemy import create_engine, inspect, text
import pandas as pd
from shapely import wkt
import psycopg2

engine = create_engine("postgresql://aqola_user:mysecretpassword@localhost:5432/aqola")

# drop all current tables and recreate them empty
def initialise_db():
    with engine.connect() as conn:
        with open("./database/init/initialise.sql") as sqlFile:
            query = text(sqlFile.read())
            conn.execute(query)
            conn.commit()

# pushes a csv into a given table
def ingest_table(filePath, tableName):
    inspector = inspect(engine)
    if tableName not in inspector.get_table_names():
        print(f"Table doesn't exist: {tableName}")
    else:
        try:
            data = pd.read_csv(filePath)
            # convert geometry if present as WKT
            if 'geometry' in data.columns:
                data['geometry'] = data['geometry'].apply(wkt.loads)

            data.to_sql(
                tableName,
                engine,
                if_exists="append",
                index=False
            )
        except Exception as e:
            print(f"Error ingesting {tableName}: {e}")

# get a number of rows from a given table
def get_rows(numRows, table):
    conn = psycopg2.connect(
        database = "aqola",
        user = "aqola_user",
        password="mysecretpassword",
        host="localhost",
        port = "5432"
    )
    cursor = conn.cursor()
    query = f"SELECT * FROM {table} LIMIT {numRows};"
    cursor.execute(query)
    print("=====================================================")
    print(cursor.fetchall())
    conn.close()
