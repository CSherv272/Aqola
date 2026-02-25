# API

- Setup in FastAPI
- Broadly, you have models which handle teh format that requests to teh DB and returns to the frontend should be
  - These are found in response_models and db_models.py
- Otherwise, you have routing and logic files
  - the routers folder houses the files that deal with the logic, api.py deals with routes to those files
- See confluence for more details (data folder)

## Running for Development

- If you want to run the backend in development mode, make sure:
  - You have postgres running on your docker container
    - docker compose up -d --build
    - stop the backend container
  - Go to ./backend/api
  - Run: fastapi run api.py --reload
    - This starts the server up to refresh on reload - good for development

### Troubleshooting

- You needs to install all requirements from the txt file in the root folder
- You can install requirements by:
  - pip install -r ../../requirements.txt

## Dockerfile

- This is used by the docker-compose yaml which then re-routes it to port 8000
- Don't use this for development or deployment, it's just here for documentation
- Hosts API on localhost:9001
- Started in command prompt by:
<<<<<<< HEAD
  - docker build --tag "api-instance" .
  - docker run -p 8000:9001 api-instance
=======
  - docker build --tag "api-instance" . OR docker build -t api-instance -f backend/api/Dockerfile . from root
    #- docker run -p 9001:9001 api-instance
  - docker run -p 9001:9001 --name aqola-api-final --network=aqola-net -e DATABASE_URL=postgresql://aqola_user:mysecretpassword@aqola-postgres:5432/aqola api-instance

  # the docker startup command was updated to include the network bridge and the correct database address. This fixed the 500 error and got the data loading correctly."
>>>>>>> d742e96ffe1d054d16500ed800ee13dc7e0fbd9d

## Setup

- ensure you have .env file in backend/api with the following variables:
  - DATABASE_URL=postgresql://aqola_user:{password}@db:5432/aqola
