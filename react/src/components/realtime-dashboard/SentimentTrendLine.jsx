import React, { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

export default function SentimentTrendLine({ reviews }) {
  // Aggregate by date
  const data = useMemo(() => {
    const map = {}
    reviews.forEach((r) => {
      const d = new Date(r.reviewTime).toLocaleDateString()
      map[d] = map[d] || { date: d, positive: 0, neutral: 0, negative: 0 }
      map[d][r.sentiment] += 1
    })
    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )
  }, [reviews])

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Sentiment Over Time</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="positive" stroke="#4caf50" />
          <Line type="monotone" dataKey="neutral" stroke="#9c27b0" />
          <Line type="monotone" dataKey="negative" stroke="#ff5722" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
