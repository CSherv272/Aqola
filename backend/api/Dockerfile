FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./backend/api/ /code/api/

EXPOSE 9001

# CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "9001"]
CMD ["fastapi", "run", "/code/api/api.py", "--port", "9001"]