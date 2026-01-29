# Database Testing Automation

# Create a virtual environment (if not already present)

python -m venv venv

# NOTE: If you get an 'UnauthorizedAccess' error (this is only for Windows users), run:

# Activate on Windows (PowerShell)

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

.\venv\Scripts\activate

# Once the (venv) indicator is visible in your terminal, install the following:

pip install psycopg2-binary python-dotenv

# Ensure your .env file contains the correct DB_PORT=5432 and credentials. Make sure docker is running based on docker-compose-doc.md instructions. Then execute the runner:

python test_scripts/run_db_test.py

# TROUBLESHOOTING

If the Python runner fails to connect, follow these steps to resolve environment conflicts:

### 1. Port Collision (Connection Refused/Abort)

A local PostgreSQL instance or a "ghost" process may be hijacking port **5432**.

- **Identify the conflict:** Run `netstat -ano | findstr :5431` to find the **PID** (the number on the far right).
- **Kill the process:** Use the PID to terminate the listener:

  ```bash
  taskkill /F /PID <PID_NUMBER>
  ```

If the Python runner fails to connect, follow these steps to resolve environment conflicts:

### 2. Credential Desync (Authentication Failed)

Docker volumes persist the first credentials used during initialization. If you updated the .env file recently, the database may still be using old credentials.

Wipe the volume memory and force a fresh build by running

```docker-compose down -v
docker-compose up -d
```

### 3. Credential Desync (Authentication Failed)

The database requires time to initialize PostGIS extensions and internal schemas
Always run docker ps and ensure the status is (healthy) before executing the Python script. If it says (starting), the connection will be rejected
