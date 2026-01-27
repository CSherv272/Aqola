# API

- Setup in FastAPI

# Dockerfile

- Hosts API on localhost:9001
- Started in command prompt by:
  - docker build --tag "api-instance" .
  - docker run -p 9001:9001 api-instance

# Setup

- ensure you have .env file in backend/api with the following variables:
  - DATABASE_URL=postgresql://aqola_user:{password}@db:5431/aqola
