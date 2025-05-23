from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, to_json, struct, when, concat_ws
from pyspark.sql.types import StructType, StringType, DoubleType
from pyspark.ml import PipelineModel
import os


spark = (
    SparkSession.builder
    .appName("Kafka-Reviews-Predict")
    .getOrCreate()
)


MODEL_PATH = os.getenv("MODEL_PATH", "/opt/spark-model")
model = PipelineModel.load(MODEL_PATH)
print(f"✅ Loaded model from {MODEL_PATH}")


schema = (
    StructType()
        .add("reviewerID",      StringType())
        .add("asin",            StringType())
        .add("reviewerName",    StringType())
        .add("helpful",         StringType())
        .add("reviewText",      StringType())
        .add("overall",         DoubleType())
        .add("summary",         StringType())
        .add("unixReviewTime",  StringType())
        .add("reviewTime",      StringType())
        .add("reviewed_at",     StringType())
)


BOOTSTRAP   = "kafka:9092,kafka2:9092,kafka3:9092,kafka4:9092"
SOURCE_TOP  = "reviews"
TARGET_TOP  = "predicted-reviews"


raw_reviews = (
    spark.readStream.format("kafka")
         .option("kafka.bootstrap.servers", BOOTSTRAP)
         .option("subscribe", SOURCE_TOP)
         .option("startingOffsets", "earliest")
         .load()
)

parsed = raw_reviews.select(
    from_json(col("value").cast("string"), schema).alias("data")
).select("data.*")


inference_df = parsed.withColumn(
    "full_review",
    concat_ws(" ", col("summary"), col("reviewText"))
)


predicted = model.transform(inference_df)


labeled = predicted.withColumn(
    "sentiment",
    when(col("prediction") == 0, "positive")
    .when(col("prediction") == 1, "negative")
    .otherwise("neutral")
)


PUBLISH_COLS = [
    "reviewerID", "asin", "reviewerName", "helpful",
    "full_review",          
    "overall", "summary", "reviewText",
    "unixReviewTime", "reviewTime", "reviewed_at",
    "sentiment"             
]


out = labeled.select(to_json(struct(*PUBLISH_COLS)).alias("value"))

(
    out.writeStream
       .format("kafka")
       .option("kafka.bootstrap.servers", BOOTSTRAP)
       .option("topic", TARGET_TOP)
       .option("checkpointLocation", "/tmp/kafka-checkpoint")  
       .outputMode("append")
       .start()
       .awaitTermination()
)