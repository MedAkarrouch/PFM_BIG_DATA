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

export function ReviewerInsights({ reviews }) {
  const counts = {}
  reviews.forEach((r) => {
    const name = r.reviewerName || "Anonymous"
    counts[name] = (counts[name] || 0) + 1
  })

  const topReviewers = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Top Reviewers</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={topReviewers} margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6">
            <LabelList dataKey="count" position="right" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
