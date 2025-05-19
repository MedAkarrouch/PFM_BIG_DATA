// Filters.jsx
function Filters({ sentiment, setSentiment }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 bg-white px-4 py-3 rounded-xl shadow">
      <label
        htmlFor="sentiment"
        className="text-sm font-semibold text-gray-700"
      >
        Filter by Sentiment:
      </label>
      <select
        id="sentiment"
        value={sentiment}
        onChange={(e) => setSentiment(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      >
        <option value="">All</option>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
    </div>
  )
}

export default Filters
