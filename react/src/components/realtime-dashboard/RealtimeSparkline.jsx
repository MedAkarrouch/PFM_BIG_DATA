// RealtimeSparkline.jsx
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"

function RealtimeSparkline({ reviews }) {
  const rollingCounts = []
  let p = 0,
    n = 0,
    neu = 0
  let timeLabel = ""

  for (let i = reviews.length - 1; i >= 0; i--) {
    const r = reviews[i]
    if (r.sentiment === "positive") p++
    if (r.sentiment === "neutral") neu++
    if (r.sentiment === "negative") n++

    if ((reviews.length - i) % 10 === 0 || i === 0) {
      timeLabel = new Date(r.reviewed_at).toLocaleTimeString()
      rollingCounts.unshift({
        time: timeLabel,
        positive: p,
        neutral: neu,
        negative: n
      })
      p = 0
      n = 0
      neu = 0
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Real-Time Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={rollingCounts} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" fontSize={11} minTickGap={20} />
          <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip
            formatter={(value, name, props) => {
              const total =
                props.payload.positive +
                props.payload.neutral +
                props.payload.negative
              const percent = (value / total) * 100
              return [`${percent.toFixed(1)}%`, name]
            }}
          />

          <Area
            type="monotone"
            dataKey="positive"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            stackId="1"
            stroke="#eab308"
            fill="#eab308"
          />
          <Area
            type="monotone"
            dataKey="negative"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RealtimeSparkline
