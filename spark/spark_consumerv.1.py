from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, udf, to_json, struct
from pyspark.sql.types import StructType, StringType, DoubleType
import random

# 1. Create Spark session
spark = SparkSession.builder \
    .appName("KafkaToKafkaClean") \
    .getOrCreate()

# 2. Define random sentiment generator
def random_sentiment():
    return random.choice(["positive", "neutral", "negative"])

sentiment_udf = udf(random_sentiment, StringType())

# 3. Define the schema of the review JSON
schema = StructType() \
    .add("reviewerID", StringType()) \
    .add("asin", StringType()) \
    .add("reviewerName", StringType()) \
    .add("helpful", StringType()) \
    .add("reviewText", StringType()) \
    .add("overall", DoubleType()) \
    .add("summary", StringType()) \
    .add("unixReviewTime", StringType()) \
    .add("reviewTime", StringType()) \
    .add("reviewed_at", StringType())

# 4. Read Kafka stream from topic "reviews"
raw_reviews = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092,kafka2:9092,kafka3:9092,kafka4:9092") \
    .option("subscribe", "reviews") \
    .option("startingOffsets", "earliest") \
    .load()

# 5. Parse the Kafka value column as JSON into structured data
parsed_reviews = raw_reviews.select(
    from_json(col("value").cast("string"), schema).alias("data")
)

# 6. Add sentiment column
enriched_reviews = parsed_reviews.select("data.*") \
    .withColumn("sentiment", sentiment_udf())

# 7. Convert to JSON for output
kafka_output = enriched_reviews.select(
    to_json(struct("*")).alias("value")
)

# 8. Write results to new Kafka topic "predicted-reviews"
kafka_output.writeStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092,kafka2:9092,kafka3:9092,kafka4:9092") \
    .option("topic", "predicted-reviews") \
    .option("checkpointLocation", "/tmp/kafka-checkpoint") \
    .outputMode("append") \
    .start() \
    .awaitTermination()


# from pyspark.sql import SparkSession
# from pyspark.sql.functions import col, from_json, udf, to_json, struct
# from pyspark.sql.types import StructType, StringType, DoubleType
# import random

# # 1. Spark session (no Mongo config anymore)
# spark = SparkSession.builder \
#     .appName("KafkaToKafka") \
#     .getOrCreate()

# # 2. Define a random sentiment function and UDF
# def random_sentiment():
#     return random.choice(["positive", "neutral", "negative"])

# sentiment_udf = udf(random_sentiment, StringType())

# # 3. Review schema
# schema = StructType() \
#     .add("reviewerID", StringType()) \
#     .add("asin", StringType()) \
#     .add("reviewText", StringType()) \
#     .add("summary", StringType()) \
#     .add("overall", DoubleType()) \
#     .add("reviewerName", StringType()) \
#     .add("reviewTime", StringType())

# # 4. Read from Kafka topic "reviews"
# df = spark.readStream.format("kafka") \
#     .option("kafka.bootstrap.servers", "kafka:9092") \
#     .option("subscribe", "reviews") \
#     .option("startingOffsets", "earliest") \
#     .load()

# # 5. Parse value as JSON
# json_df = df.selectExpr("CAST(value AS STRING) as json")

# # 6. Extract fields from JSON
# parsed_df = json_df.select(from_json(col("json"), schema).alias("data")).select("data.*")

# # 7. Add random sentiment column
# with_sentiment_df = parsed_df.withColumn("sentiment", sentiment_udf())

# # 8. Convert to JSON format for Kafka output
# kafka_ready = with_sentiment_df.select(to_json(struct("*")).alias("value"))

# # 9. Write to new Kafka topic
# kafka_ready.writeStream \
#     .format("kafka") \
#     .option("kafka.bootstrap.servers", "kafka:9092") \
#     .option("topic", "predicted-reviews") \
#     .option("checkpointLocation", "/tmp/kafka-checkpoint") \
#     .outputMode("append") \
#     .start() \
#     .awaitTermination()
