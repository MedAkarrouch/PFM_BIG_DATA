// EnhancedDashboard.jsx
// [...existing code above remains unchanged...]

// SentimentChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function SentimentChart({ reviews }) {
  const grouped = reviews.reduce((acc, r) => {
    const timestamp = new Date(r.reviewed_at)
    const rounded = new Date(Math.floor(timestamp.getTime() / 30000) * 30000) // group per 5 seconds
    const label = rounded.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
    acc[label] = acc[label] || {
      time: label,
      positive: 0,
      neutral: 0,
      negative: 0
    }
    acc[label][r.sentiment]++
    return acc
  }, {})

  const data = Object.values(grouped).sort(
    (a, b) =>
      new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`)
  )

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-2">Sentiment Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" fontSize={10} minTickGap={20} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="positive"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="neutral"
            stroke="#eab308"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentChart
