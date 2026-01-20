FROM python:3.10-slim

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 9001

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "9001"]