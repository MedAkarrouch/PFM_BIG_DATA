// RealTimeDashboard.jsx
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import RealTimeHeader from "../components/realtime-dashboard/RealTimeHeader"
import RealtimeSparkline from "../components/realtime-dashboard/RealtimeSparkline"
import SentimentDistribution from "../components/static-dashboard/SentimentDistribution"
import TopReviewersChart from "../components/realtime-dashboard/TopReviewersChart"
import TopProductsChart from "../components/realtime-dashboard/TopProductsChart"
import IncomingReviewsFeed from "../components/realtime-dashboard/IncomingReviewsFeed"
import Navbar from "../ui/Navbar"

function RealTimeDashboard() {
  const [reviews, setReviews] = useState([])
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const socket = io("http://localhost:5000")
    socket.on("connect", () => console.log("✅ Connected to WebSocket"))
    socket.on("new_review", (data) => {
      setReviews((r) => [data, ...r])
    })
    return () => socket.disconnect()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <RealTimeHeader reviews={reviews} />

        <div className="grid grid-cols-1 gap-6">
          <RealtimeSparkline reviews={reviews} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IncomingReviewsFeed reviews={reviews} />
          {/* <SentimentDistribution reviews={reviews} /> */}
          <TopReviewersChart reviews={reviews} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopProductsChart reviews={reviews} sentiment="positive" />
          <TopProductsChart reviews={reviews} sentiment="negative" />
        </div>
      </div>
    </div>
  )
}

export default RealTimeDashboard
