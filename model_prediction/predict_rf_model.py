#!/usr/bin/env python
"""
predict_rf_model.py – load a previously-trained Spark ML pipeline
                         and run it on a JSON dataset
"""

import os
import sys
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix

print("✅ Using Python from:", sys.executable)

# ------------------------------------------------------------------
# 1. Spark session (reuse if one already exists)
# ------------------------------------------------------------------
spark = (
    SparkSession.builder
    .appName("PredictRandomForest")
    .getOrCreate()
)

# ------------------------------------------------------------------
# 2. Paths – adjust if you move things around
# ------------------------------------------------------------------
# base directory = folder that contains this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model")            # model/
TEST_PATH  = os.path.join(BASE_DIR,"test.json")

# ------------------------------------------------------------------
# 3. Load the trained pipeline model
# ------------------------------------------------------------------
print(f"🔄  Loading model from: {MODEL_PATH}")
model = PipelineModel.load(MODEL_PATH)

# ------------------------------------------------------------------
# 4. Read data to predict on
#     Spark expects newline-delimited JSON (one object per line)
# ------------------------------------------------------------------
print(f"🔄  Reading test data from: {TEST_PATH}")
test_df = spark.read.json(TEST_PATH)

# ------------------------------------------------------------------
# 5. Run the model
# ------------------------------------------------------------------
pred_df = model.transform(test_df)

# ------------------------------------------------------------------
# 6. Evaluate – Spark accuracy + sklearn detailed report
# ------------------------------------------------------------------
evaluator = MulticlassClassificationEvaluator(
    labelCol="label",
    predictionCol="prediction",
    metricName="accuracy"
)
accuracy = evaluator.evaluate(pred_df)
print(f"\n⭐ Spark accuracy on test set: {accuracy:.3f}")

# convert to pandas for sklearn metrics
pdf = pred_df.select("label", "prediction").toPandas()
y_true = pdf["label"].astype(int)
y_pred = pdf["prediction"].astype(int)

label_names = {0: "positive", 1: "negative", 2: "neutral"}
target_names = [label_names[i] for i in sorted(label_names)]

print("\n=== Classification Report (scikit-learn) ===")
print(
    classification_report(
        y_true,
        y_pred,
        labels=sorted(label_names),
        target_names=target_names,
        digits=3
    )
)

print("\n=== Confusion Matrix ===")
cm = confusion_matrix(y_true, y_pred, labels=sorted(label_names))
cm_df = pd.DataFrame(cm, index=target_names, columns=target_names)
print(cm_df.to_string())

# ------------------------------------------------------------------
# 7. Clean exit
# ------------------------------------------------------------------
spark.stop()
print("\n✅ Done – predictions complete.")
