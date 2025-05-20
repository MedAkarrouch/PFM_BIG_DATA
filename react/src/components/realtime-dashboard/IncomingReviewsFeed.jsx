function IncomingReviewsFeed({ reviews }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow max-h-[400px] overflow-y-auto">
      <h3 className="font-semibold mb-4">Latest Incoming Reviews</h3>
      <ul className="space-y-2 text-sm">
        {reviews.slice(0, 20).map((r, i) => (
          <li key={i} className="border-b pb-2">
            <div className="font-medium text-gray-800">
              {r.reviewerName || "Anonymous"}
            </div>
            <div className="text-gray-600 italic">{r.summary}</div>
            <div className="text-xs text-gray-500">
              {new Date(r.reviewed_at).toLocaleTimeString()} -
              <span
                className={`ml-1 font-semibold capitalize ${
                  r.sentiment === "positive"
                    ? "text-green-600"
                    : r.sentiment === "negative"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {r.sentiment}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IncomingReviewsFeed
