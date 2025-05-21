FROM bitnami/spark:3.3.2

WORKDIR /app

# ---- Python deps -----------------------------------------------------
USER 0
RUN install_packages python3-pip && \
    pip3 install --no-cache-dir numpy==1.23.* pandas==2.2.* scikit-learn==1.4.*
USER 1001
# ----------------------------------------------------------------------

COPY spark_consumer.py .

CMD ["/bin/bash","-c", \
     "/opt/bitnami/scripts/spark/run.sh & \
      sleep 20 && \
      /opt/bitnami/spark/bin/spark-submit \
        --master spark://spark-master:7077 \
        --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2 \
        /app/spark_consumer.py" \
]




# FROM bitnami/spark:3.3.2

# WORKDIR /app

# # ---- Python / ML deps ----------------------------------------
# # we need root to install; then drop back to the bitnami user (1001)
# USER 0
# RUN install_packages python3-pip && \
#     pip3 install --no-cache-dir \
#          numpy==1.23.* \
#          pandas==2.2.* \
#          scikit-learn==1.4.*
# USER 1001
# # --------------------------------------------------------------

# # training artefacts
# COPY model/ /app/model/
# COPY spark_consumer.py .

# use the JSON-form CMD so quoting is painless
CMD ["/bin/bash","-c", \
     "/opt/bitnami/scripts/spark/run.sh & \
      sleep 20 && \
      /opt/bitnami/spark/bin/spark-submit \
          --master spark://spark-master:7077 \
          --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2 \
          /app/spark_consumer.py" \
]


# FROM bitnami/spark:3.3.2

# WORKDIR /app

# COPY spark_consumer.py .

# CMD bash -c "/opt/bitnami/scripts/spark/run.sh & sleep 20 && /opt/bitnami/spark/bin/spark-submit --master spark://spark-master:7077 --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2 /app/spark_consumer.py"

# FROM bitnami/spark:3.3.2


# # Set working directory
# WORKDIR /app

# # Copy the Spark consumer script into the image
# COPY spark_consumer.py .

# CMD ["/opt/bitnami/spark/bin/spark-submit", "--packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.2", "/app/spark_consumer.py"]

