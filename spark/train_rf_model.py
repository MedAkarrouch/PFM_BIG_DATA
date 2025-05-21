import sys
print("✅ Using Python from:", sys.executable)


from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.feature import Tokenizer, StopWordsRemover, CountVectorizer, IDF
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import pandas as pd


import os
from pyspark.ml import Pipeline

# 1. Create Spark session
spark = SparkSession.builder.appName("TrainRandomForest").getOrCreate()

# 2. Load raw training data (must include: full_review, label)
# train_df = spark.read.json("./train.json")
train_df = spark.read.json(r"C:\Users\hp\Desktop\PFM_BIG_DATA\model_prediction\train.json")

# 3. Define preprocessing + model pipeline (same as notebook)
tokenizer = Tokenizer(inputCol="full_review", outputCol="words")
stopwords = StopWordsRemover(inputCol="words", outputCol="filtered")
vectorizer = CountVectorizer(inputCol="filtered", outputCol="raw_features", vocabSize=10000, minDF=5)
idf = IDF(inputCol="raw_features", outputCol="features")

# 4. RandomForest classifier
rf = RandomForestClassifier(
    featuresCol="features", 
    labelCol="label", 
    numTrees=100, 
    maxDepth=20, 
    seed=42
)

# 5. Create pipeline
pipeline = Pipeline(stages=[tokenizer, stopwords, vectorizer, idf, rf])

# 6. Fit the model
model = pipeline.fit(train_df)

# 1. Load validation and test data
# val_df  = spark.read.json("./val.json")
val_df = spark.read.json(r"C:\Users\hp\Desktop\PFM_BIG_DATA\model_prediction\val.json")
test_df = spark.read.json(r"C:\Users\hp\Desktop\PFM_BIG_DATA\model_prediction\test.json")
# test_df = spark.read.json("./test.json")

# 2. Generate predictions using trained model in memory
val_pred  = model.transform(val_df)
test_pred = model.transform(test_df)

# 3. Spark accuracy evaluator
evaluator = MulticlassClassificationEvaluator(
    labelCol="label",
    predictionCol="prediction",
    metricName="accuracy"
)

print(f"\nValidation Accuracy (Spark): {evaluator.evaluate(val_pred):.3f}")
print(f"Test       Accuracy (Spark): {evaluator.evaluate(test_pred):.3f}")

# 4. Helper function to print sklearn metrics
def sk_report(predictions, name):
    pdf = predictions.select("label", "prediction").toPandas()
    y_true = pdf["label"].astype(int)
    y_pred = pdf["prediction"].astype(int)

    label_names = {0: "positive", 1: "negative", 2: "neutral"}
    target_names = [label_names[i] for i in sorted(label_names)]

    print(f"\n=== {name} Classification Report ===")
    report_dict = classification_report(
        y_true,
        y_pred,
        labels=sorted(label_names),
        target_names=target_names,
        digits=3,
        output_dict=True
    )
    report_df = pd.DataFrame(report_dict).transpose()
    print(report_df.round(3).to_string())

    print(f"\n=== {name} Confusion Matrix ===")
    cm = confusion_matrix(y_true, y_pred, labels=sorted(label_names))
    cm_df = pd.DataFrame(cm, index=target_names, columns=target_names)
    print(cm_df.to_string())

# 5. Run reports
sk_report(val_pred,  "Validation")
sk_report(test_pred, "Test")

# # 7. Save the model
output_path = "./model"

model.write().overwrite().save(output_path)
print(f"✅ RandomForest model saved to: {output_path}")
