// EnhancedDashboard.jsx
import { useEffect, useState } from "react"
import SummaryBoxes from "../components/static-dashboard/SummaryBoxes"
import SentimentChart from "../components/static-dashboard/SentimentChart"
import TopProductsChart from "../components/static-dashboard/TopProductsChart"
import Filters from "../components/static-dashboard/Filters"
import ReviewsTable from "../components/static-dashboard/ReviewsTable"
import Navbar from "../ui/Navbar"

function StaticDashboard() {
  const [allReviews, setAllReviews] = useState([])
  const [sentiment, setSentiment] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => setAllReviews(data))
      .catch((err) => console.log("Error = ", err))
  }, [])

  const filteredReviews = sentiment
    ? allReviews.filter((r) => r.sentiment === sentiment)
    : allReviews

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Enhanced Reviews Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryBoxes reviews={allReviews} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SentimentChart reviews={allReviews} />
          <TopProductsChart reviews={allReviews} />
        </div>

        <Filters sentiment={sentiment} setSentiment={setSentiment} />
        <ReviewsTable reviews={filteredReviews} />
      </div>
    </div>
  )
}

export default StaticDashboard
