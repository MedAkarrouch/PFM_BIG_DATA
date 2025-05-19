// TopProductsChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

function TopProductsChart({ reviews }) {
  const counts = {}
  reviews.forEach((r) => {
    if (r.sentiment === "positive") {
      counts[r.asin] = (counts[r.asin] || 0) + 1
    }
  })

  const data = Object.entries(counts)
    .map(([asin, count]) => ({ asin, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-2">
        Top Products by Positive Reviews
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 30, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="asin" type="category" width={90} fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill="#22c55e" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TopProductsChart
