import json
import time
from datetime import datetime
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

def wait_for_kafka():
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers=[
                    'kafka:9092',
                    'kafka2:9092',
                    'kafka3:9092',
                    'kafka4:9092'
                ],
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: str(k).encode('utf-8')
            )
            print("✅ Kafka is ready.")
            return producer
        except NoBrokersAvailable:
            print("⏳ Kafka not available yet, retrying...")
            time.sleep(10)

producer = wait_for_kafka()

with open('reviews.json') as f:
    reviews = json.load(f)

RATE = 5
DELAY = 3    


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