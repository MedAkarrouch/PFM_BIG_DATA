import { Link, useLocation } from "react-router-dom"
import logo from "../../public/logo.png"

export default function Navbar() {
  const { pathname } = useLocation()

  const navItems = [
    { path: "/real-time", label: "Real-Time Dashboard" },
    { path: "/static", label: "Static Dashboard" }
  ]

  return (
    <nav className="bg-white shadow px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-10 h-auto" />
        <div className="flex gap-2 md:gap-4">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === path
                  ? "bg-blue-500 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
