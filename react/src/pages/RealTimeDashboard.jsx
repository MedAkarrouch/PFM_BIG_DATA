import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import Navbar from "../ui/Navbar"
import SentimentTrendLine from "../components/realtime-dashboard/SentimentTrendLine"
import SentimentPieChart from "../components/realtime-dashboard/SentimentPieChart"
import LatestReviewsTable from "../components/realtime-dashboard/LatestReviewsTable"

function RealTimeDashboard() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const socket = io("http://localhost:5000")
    socket.on("connect", () => console.log("✓ connected to socket-service"))
    socket.on("new_review", (data) => {
      console.log("📡 new_review", data)
      setReviews((r) => [data, ...r])
    })
    return () => socket.disconnect()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h1>Live Sentiment Dashboard</h1>
        <SentimentTrendLine reviews={reviews} />
        <SentimentPieChart reviews={reviews} />
        <LatestReviewsTable reviews={reviews} />
      </div>
    </div>
  )
}

export default RealTimeDashboard
