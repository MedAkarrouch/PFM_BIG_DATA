import { useEffect, useState } from "react"
import { io } from "socket.io-client"

function App() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const socket = io("http://localhost:5000")
    socket.on("connect", () => console.log("✓ connected to socket-service"))
    socket.on("new_review", (data) => {
      console.log("📡 new_review", data)
      setReviews((r) => [data, ...r])
    })
    return () => socket.disconnect()
  }, [])

  return (
    <div>
      <h1>Live Reviews</h1>
      <ul>
        {reviews.map((r, i) => (
          <li key={i}>
            <strong>{r.reviewerName}</strong>: {r.reviewText} —{" "}
            <em>{r.sentiment}</em>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
