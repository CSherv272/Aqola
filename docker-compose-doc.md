# AQOLA Docker Compose Setup

Docker compose allows for you to set up the development environment quickly and easily. One command will spin up the db, backend, and frontend services.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Git

### 1. Set up your environment variables

Create a file named `.env` in the root directory of the project. Populate it with the necessary environment variables. (i.e. database credentials, API keys, etc.) The '.env.example' file can be used as a reference.

### 2. Spin up the services

Run the following command in the terminal from the root directory of the project:

```bash
docker-compose up -d
```

### 3. Access the services

- Frontend: "http://localhost:3000"
- Backend: "http://localhost:8000"
- Database: PostgreSQL running on port 5431

## Connect to the database cli from the container

To connect to the PostgreSQL database running in the Docker container, use the following command:

```bash
docker exec -it aqola-postgres psql -U aqola_user -d aqola
```
