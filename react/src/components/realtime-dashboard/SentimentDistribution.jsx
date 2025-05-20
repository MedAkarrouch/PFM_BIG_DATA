// SentimentDistribution.jsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"

const COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444"
}

function SentimentDistribution({ reviews }) {
  const counts = { positive: 0, neutral: 0, negative: 0 }
  const safeReviews = Array.isArray(reviews) ? reviews : []
  safeReviews.forEach((r) => counts[r.sentiment]++)
  const total = counts.positive + counts.neutral + counts.negative

  const data = Object.entries(counts).map(([k, v]) => ({
    name: k,
    value: v,
    percent: total > 0 ? v / total : 0
  }))

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Live Sentiment Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Count"]} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentDistribution
