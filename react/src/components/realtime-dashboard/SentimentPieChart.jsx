import React, { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const COLORS = {
  positive: "#4caf50",
  neutral: "#9c27b0",
  negative: "#ff5722"
}

export default function SentimentPieChart({ reviews }) {
  // Count each sentiment
  const data = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 }
    reviews.forEach((r) => counts[r.sentiment]++)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [reviews])

  return (
    <div style={{ width: 300, height: 300, margin: "2rem auto" }}>
      <h3>Current Distribution</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
