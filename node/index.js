const { Kafka } = require("kafkajs")
const cors = require("cors")
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const { MongoClient } = require("mongodb")

const MONGO_URI = "mongodb://mongodb:27017"
const DB_NAME = "reviewsdb"
const COLL_NAME = "reviews"

const KAFKA_BROKERS = [
  "kafka:9092",
  "kafka2:9092",
  "kafka3:9092",
  "kafka4:9092"
]
const KAFKA_TOPIC = "predicted-reviews"

async function initMongo() {
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  console.log("✅ Connected to MongoDB")
  return client.db(DB_NAME).collection(COLL_NAME)
}

async function initKafkaConsumer(onMessage) {
  const kafka = new Kafka({
    clientId: "socket-service",
    brokers: KAFKA_BROKERS,
    connectionTimeout: 3000,
    retry: { retries: 5 }
  })
  const consumer = kafka.consumer({ groupId: "socket-service-group" })

  // retry loop until Kafka is ready
  while (true) {
    try {
      await consumer.connect()
      console.log("✅ Connected to Kafka")
      await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false })
      break
    } catch (e) {
      console.warn("⚠️ Kafka not ready, retrying in 5s…", e.message)
      await new Promise((res) => setTimeout(res, 5000))
    }
  }

  await consumer.run({
    eachMessage: async ({ message }) => {
      const review = JSON.parse(message.value.toString())
      onMessage(review)
    }
  })
}

async function main() {
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server, { cors: { origin: "*" } })
  app.use(cors({ origin: "*" }))

  const collection = await initMongo()

  // REST endpoint for last 10
  app.get("/history", async (req, res) => {
    const docs = await collection.find().sort({ _id: -1 }).toArray()
    docs.forEach((d) => (d._id = d._id.toHexString()))
    res.json(docs)
  })

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id)
  })

  initKafkaConsumer(async (review) => {
    // save and broadcast
    const { insertedId } = await collection.insertOne(review)
    review._id = insertedId.toHexString()
    io.emit("new_review", review)
  })

  server.listen(5000, () => console.log("🚀 socket-service listening on 5000"))
}

main().catch((err) => {
  console.error("❌ socket-service failed to start", err)
  process.exit(1)
})
