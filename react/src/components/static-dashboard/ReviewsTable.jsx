// ReviewsTable.jsx
import { useState } from "react"
import { Card, CardContent } from "../../ui/Card"

function ReviewsTable({ reviews }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentRows = reviews.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(reviews.length / rowsPerPage)

  return (
    <Card className="mt-6">
      <CardContent className="overflow-auto p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Review Entries
        </h3>
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
            {currentRows.map((r, i) => (
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

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded font-medium transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewsTable
