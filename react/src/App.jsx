import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import RealTimeDashboard from "./pages/RealTimeDashboard"
import StaticDashboard from "./pages/StaticDashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/real-time" />} />
        <Route path="/real-time" element={<RealTimeDashboard />} />
        <Route path="/static" element={<StaticDashboard />} />
        <Route
          path="*"
          element={<div className="p-4 text-red-600">404 Not Found</div>}
        />
      </Routes>
    </Router>
  )
}

export default App
