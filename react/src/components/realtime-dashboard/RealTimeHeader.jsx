function RealTimeHeader({ reviews }) {
  const total = reviews.length
  const positive = reviews.filter((r) => r.sentiment === "positive").length
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length
  const negative = reviews.filter((r) => r.sentiment === "negative").length

  return (
    <div className="bg-white rounded-xl shadow p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total", count: total, color: "text-gray-800" },
        { label: "Positive", count: positive, color: "text-green-600" },
        { label: "Neutral", count: neutral, color: "text-yellow-600" },
        { label: "Negative", count: negative, color: "text-red-600" }
      ].map((box) => (
        <div key={box.label} className="text-center">
          <div className={`text-2xl font-bold ${box.color}`}>{box.count}</div>
          <div className="text-sm text-gray-500">{box.label}</div>
        </div>
      ))}
    </div>
  )
}

export default RealTimeHeader
