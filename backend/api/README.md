# API

- Setup in FastAPI

# Dockerfile

- Hosts API on localhost:9001
- Started in command prompt by:
  - docker build --tag "api-instance" . OR docker build -t api-instance -f backend/api/Dockerfile . from root
    #- docker run -p 9001:9001 api-instance
  - docker run -p 9001:9001 --name aqola-api-final --network=aqola-net -e DATABASE_URL=postgresql://aqola_user:mysecretpassword@aqola-postgres:5432/aqola api-instance

  # the docker startup command was updated to include the network bridge and the correct database address. This fixed the 500 error and got the data loading correctly."

# Setup

- ensure you have .env file in backend/api with the following variables:
  - DATABASE_URL=postgresql://aqola_user:{password}@db:5432/aqola
