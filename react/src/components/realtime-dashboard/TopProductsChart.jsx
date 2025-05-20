import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts"

export default function TopProductsChart({ reviews, sentiment }) {
  const productMap = {}
  reviews.forEach((r) => {
    if (r.sentiment === sentiment) {
      productMap[r.asin] = (productMap[r.asin] || 0) + 1
    }
  })

  const topProducts = Object.entries(productMap)
    .map(([asin, count]) => ({ asin, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const barColor =
    sentiment === "positive"
      ? "#22c55e"
      : sentiment === "negative"
      ? "#ef4444"
      : "#eab308"

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Top Products ({sentiment})</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={topProducts}
          margin={{ top: 20, bottom: 25, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="asin" type="category" fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill={barColor}>
            <LabelList dataKey="count" position="right" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
