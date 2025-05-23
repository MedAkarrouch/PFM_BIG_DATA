FROM python:3.10-slim

WORKDIR /app

COPY producer.py .
COPY reviews.json .

RUN pip install kafka-python

CMD ["python", "producer.py"]
