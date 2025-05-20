import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

export default function SentimentStackedBarChart({
  reviews,
  selectedYear,
  setSelectedYear
}) {
  const years = [
    ...new Set(
      reviews.map((r) => new Date(r.unixReviewTime * 1000).getFullYear())
    )
  ].sort()

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value))
  }

  const grouped = {}
  reviews.forEach((r) => {
    const date = new Date(r.unixReviewTime * 1000)
    const year = date.getFullYear()
    const month = date.toLocaleString("default", { month: "short" })
    if (year === selectedYear) {
      if (!grouped[month]) {
        grouped[month] = { month, positive: 0, neutral: 0, negative: 0 }
      }
      grouped[month][r.sentiment]++
    }
  })

  const data = Object.values(grouped)

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Sentiment by Month</h3>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border px-2 py-1 rounded text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="positive" stackId="a" fill="#22c55e" />
          <Bar dataKey="neutral" stackId="a" fill="#eab308" />
          <Bar dataKey="negative" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
