#!/bin/bash

echo "⏳ Waiting for Kafka to become available..."

# Wait until we can connect to the broker
until kafka-topics --bootstrap-server kafka:9092 --list &>/dev/null; do
  echo "Kafka broker not yet ready. Waiting..."
  sleep 5
done

echo "✅ Kafka is available. Creating topics..."

# Create 'reviews' topic
kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists \
  --topic reviews \
  --partitions 6 \
  --replication-factor 3

# Create 'predicted-reviews' topic
kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists \
  --topic predicted-reviews \
  --partitions 6 \
  --replication-factor 3

echo "✅ Topics created successfully."
