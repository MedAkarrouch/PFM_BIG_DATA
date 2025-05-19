# producer/producer.py
import json
import time
from datetime import datetime
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

def wait_for_kafka():
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: str(k).encode('utf-8')
            )
            print("✅ Kafka is ready.")
            return producer
        except NoBrokersAvailable:
            print("⏳ Kafka not available yet, retrying...")
            time.sleep(5)

# wait for Kafka to be ready
time.sleep(10)
producer = wait_for_kafka()

# load reviews
with open('reviews.json') as f:
    reviews = json.load(f)

RATE = 5     # messages per batch
DELAY = 2    # seconds between batches

# send in bursts
for i in range(0, len(reviews), RATE):
    batch = reviews[i : i + RATE]
    timestamp = datetime.utcnow().isoformat()

    for review in batch:
        review["reviewed_at"] = timestamp
        key = review.get("asin", "none")
        producer.send('reviews', key=key, value=review)
        print(f"📦 Sent: {review['reviewerID']} — {review.get('asin')} @ {timestamp}")

    producer.flush()
    print(f"✅ Batch of {len(batch)} sent; sleeping {DELAY}s...")
    time.sleep(DELAY)

print("✅ All reviews sent.")





# ***********************************************
# # producer/producer.py
# import json
# import time
# from kafka import KafkaProducer
# from kafka.errors import NoBrokersAvailable

# def wait_for_kafka():
#     while True:
#         try:
#             producer = KafkaProducer(
#                 bootstrap_servers='kafka:9092',
#                 value_serializer=lambda v: json.dumps(v).encode('utf-8')
#             )
#             print("Kafka is ready.")
#             return producer
#         except NoBrokersAvailable:
#             print("Kafka not available yet, retrying...")
#             time.sleep(5)

# time.sleep(10)  # Optional extra delay
# producer = wait_for_kafka()

# # Load and send messages
# with open('reviews.json') as f:
#     reviews = json.load(f)

# for review in reviews:
#     producer.send('reviews', review)
#     print(f"Sent: {review}")
#     time.sleep(1)

# producer.flush()
# *********************************************************************
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
