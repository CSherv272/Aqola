import pytest
import psycopg2
import os
from dotenv import load_dotenv

# Load env vars once for the session
load_dotenv()

# Fixture is a piece of code that runs and returns output before the execution of each test.
@pytest.fixture(scope="module")
def db_conn():
    """
    Creates a new database connection for a test module.
    Yields the connection to the test, then closes it after.
    """
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )
    
    yield conn  # The test runs here!
    
    conn.close() # Cleanup happens here