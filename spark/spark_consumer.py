#!/usr/bin/env python
"""
spark_app.py  –  Train once, then stream Kafka forever
"""

import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, to_json, struct, when
from pyspark.sql.types import StructType, StringType, DoubleType
from pyspark.ml import Pipeline, PipelineModel
from pyspark.ml.feature import Tokenizer, StopWordsRemover, CountVectorizer, IDF
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.evaluation import MulticlassClassificationEvaluator

# ----------------------------------------------------------------------
# 0. Spark session
# ----------------------------------------------------------------------
spark = (
    SparkSession.builder
    .appName("Train-and-Serve-RF")
    .getOrCreate()
)

# ---------- paths (adapt if you mount elsewhere) ----------------------
TRAIN_PATH = "/data/train.json"
VAL_PATH   = "/data/val.json"
TEST_PATH  = "/data/test.json"          # only for offline metrics; optional
# ----------------------------------------------------------------------

# ----------------------------------------------------------------------
# 1. TRAIN THE MODEL  (batch job runs once)
# ----------------------------------------------------------------------
print(f"📥  Reading training set   {TRAIN_PATH}")
train_df = spark.read.json(TRAIN_PATH)

tokenizer  = Tokenizer(inputCol="full_review", outputCol="words")
stopwords  = StopWordsRemover(inputCol="words", outputCol="filtered")
vectorizer = CountVectorizer(inputCol="filtered", outputCol="raw_features",
                             vocabSize=10_000, minDF=5)
idf        = IDF(inputCol="raw_features", outputCol="features")
rf         = RandomForestClassifier(labelCol="label",
                                    featuresCol="features",
                                    numTrees=100, maxDepth=20, seed=42)

pipeline   = Pipeline(stages=[tokenizer, stopwords, vectorizer, idf, rf])

print("🛠  Fitting model …")
model: PipelineModel = pipeline.fit(train_df)
print("✅ Model trained")

# --- OPTIONAL quick metrics ------------------------------------------
for split_name, path in [("val", VAL_PATH), ("test", TEST_PATH)]:
    if not spark._jsparkSession.sessionState().conf().contains("spark.driver.userClassPathFirst"):
        pass  # silence formatting bug in bitnami image
    try:
        df = spark.read.json(path)
        acc = MulticlassClassificationEvaluator(
                labelCol="label", predictionCol="prediction", metricName="accuracy"
              ).evaluate(model.transform(df))
        print(f"⭐ Accuracy on {split_name}: {acc:.3f}")
    except Exception:
        pass
# ----------------------------------------------------------------------

# ----------------------------------------------------------------------
# 2. STREAM FROM KAFKA  –  reuse the same model object
# ----------------------------------------------------------------------
BOOTSTRAP = "kafka:9092,kafka2:9092,kafka3:9092,kafka4:9092"
SOURCE    = "reviews"
TARGET    = "predicted-reviews"

schema = (
    StructType()
        .add("reviewerID",     StringType())
        .add("asin",           StringType())
        .add("reviewerName",   StringType())
        .add("helpful",        StringType())
        .add("reviewText",     StringType())   # raw text
        .add("overall",        DoubleType())
        .add("summary",        StringType())
        .add("unixReviewTime", StringType())
        .add("reviewTime",     StringType())
        .add("reviewed_at",    StringType())
)

raw = (
    spark.readStream.format("kafka")
         .option("kafka.bootstrap.servers", BOOTSTRAP)
         .option("subscribe", SOURCE)
         .option("startingOffsets", "latest")
         .load()
)

parsed = raw.select(
    from_json(col("value").cast("string"), schema).alias("d")
).select("d.*")

inference_df = parsed.withColumnRenamed("reviewText", "full_review")

predicted = model.transform(inference_df)

labeled = predicted.withColumn(
    "sentiment",
    when(col("prediction") == 0, "positive")
    .when(col("prediction") == 1, "negative")
    .otherwise("neutral")
)

query = (
    labeled.select(to_json(struct("*")).alias("value"))
           .writeStream
           .format("kafka")
           .option("kafka.bootstrap.servers", BOOTSTRAP)
           .option("topic", TARGET)
           .option("checkpointLocation", "/tmp/kafka-checkpoint")
           .outputMode("append")
           .start()
)

print("🚀 Streaming started — waiting for data …")
query.awaitTermination()





# from pyspark.sql import SparkSession
# from pyspark.sql.functions import col, from_json, to_json, struct, when
# from pyspark.sql.types import StructType, StringType, DoubleType
# from pyspark.ml import PipelineModel
# import os

# # -------------------------------------------------------------
# # 1. Spark session
# # -------------------------------------------------------------
# spark = (
#     SparkSession.builder
#     .appName("Kafka-Reviews-Predict")
#     .getOrCreate()
# )

# # -------------------------------------------------------------
# # 2. Load the saved PipelineModel
# #    (copied into the image at /app/model – see Dockerfile below)
# # -------------------------------------------------------------
# MODEL_PATH = os.getenv("MODEL_PATH", "/opt/spark-model")
# model = PipelineModel.load(MODEL_PATH)

# # MODEL_PATH = "/app/model"
# # model = PipelineModel.load(MODEL_PATH)
# print(f"✅ Loaded model from {MODEL_PATH}")

# # -------------------------------------------------------------
# # 3. Review schema coming from the producer
# # -------------------------------------------------------------
# schema = (
#     StructType()
#         .add("reviewerID",      StringType())
#         .add("asin",            StringType())
#         .add("reviewerName",    StringType())
#         .add("helpful",         StringType())
#         .add("reviewText",      StringType())      # ← the text we’ll classify
#         .add("overall",         DoubleType())
#         .add("summary",         StringType())
#         .add("unixReviewTime",  StringType())
#         .add("reviewTime",      StringType())
#         .add("reviewed_at",     StringType())
# )

# BOOTSTRAP   = "kafka:9092,kafka2:9092,kafka3:9092,kafka4:9092"
# SOURCE_TOP  = "reviews"
# TARGET_TOP  = "predicted-reviews"

# # -------------------------------------------------------------
# # 4. Read the “reviews” topic
# # -------------------------------------------------------------
# raw_reviews = (
#     spark.readStream.format("kafka")
#          .option("kafka.bootstrap.servers", BOOTSTRAP)
#          .option("subscribe", SOURCE_TOP)
#          .option("startingOffsets", "earliest")
#          .load()
# )

# parsed = raw_reviews.select(
#     from_json(col("value").cast("string"), schema).alias("data")
# ).select("data.*")

# # -------------------------------------------------------------
# # 5. Prepare the column the model expects (“full_review”)
# # -------------------------------------------------------------
# inference_df = parsed.withColumnRenamed("reviewText", "full_review")

# # -------------------------------------------------------------
# # 6. Run the model → add “prediction” (double) & “probability”
# # -------------------------------------------------------------
# predicted = model.transform(inference_df)

# # -------------------------------------------------------------
# # 7. Map numeric prediction → string label
# #    0 = positive, 1 = negative, 2 = neutral  (from your training script)
# # -------------------------------------------------------------
# labeled = predicted.withColumn(
#     "sentiment",
#     when(col("prediction") == 0, "positive")
#     .when(col("prediction") == 1, "negative")
#     .otherwise("neutral")
# )

# # -------------------------------------------------------------
# # 8. Ship everything (or only selected cols) back to Kafka
# # -------------------------------------------------------------
# out = labeled.select(
#     to_json(struct("*")).alias("value")
# )

# (
#     out.writeStream
#        .format("kafka")
#        .option("kafka.bootstrap.servers", BOOTSTRAP)
#        .option("topic", TARGET_TOP)
#        .option("checkpointLocation", "/tmp/kafka-checkpoint")  # must be on a writable volume
#        .outputMode("append")
#        .start()
#        .awaitTermination()
# )
