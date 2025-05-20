import { useEffect, useState } from "react"
import SummaryBoxes from "../components/static-dashboard/SummaryBoxes"
import SentimentStackedBarChart from "../components/static-dashboard/SentimentStackedBarChart"
import SentimentDistribution from "../components/static-dashboard/SentimentDistribution"
import ReviewsTable from "../components/static-dashboard/ReviewsTable"
import Navbar from "../ui/Navbar"

export default function StaticDashboard() {
  const [allReviews, setAllReviews] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => {
        setAllReviews(data)
        const years = [
          ...new Set(
            data.map((r) => new Date(r.unixReviewTime * 1000).getFullYear())
          )
        ].sort()
        setSelectedYear(years.at(-1))
      })
      .catch((err) => console.log("Error =", err))
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryBoxes reviews={allReviews} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SentimentStackedBarChart
            reviews={allReviews}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
          <SentimentDistribution
            reviews={allReviews}
            selectedYear={selectedYear}
          />
        </div>

        <ReviewsTable reviews={allReviews} />
      </div>
    </div>
  )
}
