// SummaryBoxes.jsx
function SummaryBoxes({ reviews }) {
  const total = reviews.length
  const positive = reviews.filter((r) => r.sentiment === "positive").length
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length
  const negative = reviews.filter((r) => r.sentiment === "negative").length

  const boxes = [
    { label: "Total", count: total, color: "bg-gray-200 text-gray-800" },
    {
      label: "Positive",
      count: positive,
      color: "bg-green-100 border border-green-300 text-green-800"
    },
    {
      label: "Neutral",
      count: neutral,
      color: "bg-yellow-100 border border-yellow-300 text-yellow-800"
    },
    {
      label: "Negative",
      count: negative,
      color: "bg-red-100 border border-red-300 text-red-800"
    }
  ]

  return (
    <>
      {boxes.map(({ label, count, color }) => (
        <div
          key={label}
          className={`rounded-2xl p-5 shadow-md ${color} flex flex-col items-center justify-center transition transform hover:scale-105`}
        >
          <div className="text-3xl font-extrabold">{count}</div>
          <div className="text-base font-medium mt-1">{label}</div>
        </div>
      ))}
    </>
  )
}

export default SummaryBoxes
