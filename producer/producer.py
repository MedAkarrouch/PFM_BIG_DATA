# producer/producer.py
import json
import time
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

def wait_for_kafka():
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            print("Kafka is ready.")
            return producer
        except NoBrokersAvailable:
            print("Kafka not available yet, retrying...")
            time.sleep(5)

time.sleep(10)  # Optional extra delay
producer = wait_for_kafka()

# Load and send messages
with open('reviews.json') as f:
    reviews = json.load(f)

for review in reviews:
    producer.send('reviews', review)
    print(f"Sent: {review}")
    time.sleep(1)

producer.flush()

# # producer/producer.py
# import json
# import time
# time.sleep(20)
# from kafka import KafkaProducer

# # Connect to Kafka inside the Docker network
# producer = KafkaProducer(
#     bootstrap_servers='kafka:9092',
#     value_serializer=lambda v: json.dumps(v).encode('utf-8')
# )

# # Load sample reviews (you can replace this with real review logic)
# with open('reviews.json') as f:
#     reviews = json.load(f)

# # Send one message per second
# for review in reviews:
#     producer.send('reviews', review)
#     print(f"Sent: {review}")
#     time.sleep(1)

# producer.flush()
