# Database Testing Automation

# Create a virtual environment (if not already present)

python -m venv venv

# Activate on Windows (PowerShell)

# NOTE: If you get an 'UnauthorizedAccess' error, run:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

.\venv\Scripts\activate

# Once the (venv) indicator is visible in your terminal, install the following:

pip install psycopg2-binary python-dotenv

# Ensure your .env file contains the correct DB_PORT=5431 and credentials. Then execute the runner:

python automation_scripts/run_db_test.py
