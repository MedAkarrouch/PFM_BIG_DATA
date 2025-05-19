import React from "react"
import "./LatestReviewsTable.css"

export default function LatestReviewsTable({ reviews }) {
  return (
    <div className="table-container">
      <h3>Latest Reviews</h3>
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Reviewer</th>
            <th>Rating</th>
            <th>Sentiment</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {reviews.slice(0, 10).map((r, i) => (
            <tr key={r._id || i}>
              <td>{r.reviewTime}</td>
              <td>{r.reviewerName}</td>
              <td>{r.overall}</td>
              <td>{r.sentiment}</td>
              <td title={r.reviewText}>
                {r.summary.length > 30
                  ? r.summary.slice(0, 30) + "…"
                  : r.summary}
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan="5" className="no-data">
                No reviews yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
