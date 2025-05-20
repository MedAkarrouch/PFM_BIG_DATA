// TopReviewersChart.jsx
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

export default function TopReviewersChart({ reviews }) {
  const reviewerMap = {}
  reviews.forEach((r) => {
    const name = r.reviewerName || "Anonymous"
    reviewerMap[name] = (reviewerMap[name] || 0) + 1
  })

  const topReviewers = Object.entries(reviewerMap)
    .map(([name, count]) => ({ name: name.split(" ")[0], count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Top Reviewers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={topReviewers}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-20}
            textAnchor="end"
            height={45}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6">
            <LabelList dataKey="count" position="top" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
