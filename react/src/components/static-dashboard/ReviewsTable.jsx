// ReviewsTable.jsx
import { useState } from "react"
import { Card, CardContent } from "../../ui/Card"

function ReviewsTable({ reviews }) {
  const [visibleCount, setVisibleCount] = useState(10)
  const [searchProductId, setSearchProductId] = useState("")
  const [searchReviewerName, setSearchReviewerName] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("")
  const years = [
    ...new Set(
      reviews.map((r) => new Date(r.unixReviewTime * 1000).getFullYear())
    )
  ].sort()
  const [yearFilter, setYearFilter] = useState("")

  const filtered = reviews.filter((r) => {
    const matchProduct = (r.asin || "")
      .toLowerCase()
      .includes(searchProductId.toLowerCase())
    const matchReviewer = (r.reviewerName || "")
      .toLowerCase()
      .includes(searchReviewerName.toLowerCase())
    const matchSentiment = sentimentFilter
      ? r.sentiment === sentimentFilter
      : true
    const matchYear = yearFilter
      ? new Date(r.unixReviewTime * 1000).getFullYear() === Number(yearFilter)
      : true
    return matchProduct && matchReviewer && matchSentiment && matchYear
  })

  const visibleRows = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleExportCSV = () => {
    const header = [
      "Reviewer",
      "Product ID",
      "Summary",
      "Sentiment",
      "Reviewed At"
    ]
    const rows = filtered.map((r) => [
      r.reviewerName,
      r.asin,
      r.summary,
      r.sentiment,
      new Date(r.reviewed_at).toLocaleString()
    ])
    const csvContent = [header, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", "reviews_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="mt-6">
      <CardContent className="overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Review Entries
          </h3>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
          >
            Export CSV
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Product ID"
            value={searchProductId}
            onChange={(e) => setSearchProductId(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full md:w-60"
          />
          <input
            type="text"
            placeholder="Filter by Reviewer Name"
            value={searchReviewerName}
            onChange={(e) => setSearchReviewerName(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full md:w-60"
          />
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full md:w-60"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full md:w-60"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <table className="w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border">Reviewer</th>
              <th className="px-3 py-2 border">Product ID</th>
              <th className="px-3 py-2 border">Summary</th>
              <th className="px-3 py-2 border">Sentiment</th>
              <th className="px-3 py-2 border">Reviewed At</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 border whitespace-nowrap font-medium">
                  {r.reviewerName}
                </td>
                <td className="px-3 py-2 border whitespace-nowrap text-xs text-gray-600">
                  {r.asin}
                </td>
                <td className="px-3 py-2 border text-gray-800">{r.summary}</td>
                <td className="px-3 py-2 border text-center capitalize">
                  <span
                    className={
                      r.sentiment === "positive"
                        ? "text-green-600 font-semibold"
                        : r.sentiment === "negative"
                        ? "text-red-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td className="px-3 py-2 border whitespace-nowrap text-sm text-gray-700">
                  {new Date(r.reviewed_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Load More
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewsTable
