FROM bitnami/spark:3.3.2

WORKDIR /app

COPY spark_consumer.py .

CMD bash -c "/opt/bitnami/scripts/spark/run.sh & sleep 20 && /opt/bitnami/spark/bin/spark-submit --master spark://spark-master:7077 --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2 /app/spark_consumer.py"

# FROM bitnami/spark:3.3.2


# # Set working directory
# WORKDIR /app

# # Copy the Spark consumer script into the image
# COPY spark_consumer.py .

# CMD ["/opt/bitnami/spark/bin/spark-submit", "--packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2", "/app/spark_consumer.py"]

