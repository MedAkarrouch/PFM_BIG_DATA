# producer/Dockerfile
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY producer.py .
COPY reviews.json .

# Install kafka client
RUN pip install kafka-python

# Run the producer
CMD ["python", "producer.py"]
