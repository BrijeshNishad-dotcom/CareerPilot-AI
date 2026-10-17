
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo */}
        {/* <Link
          to="/"
          className="shrink-0 text-xl font-bold text-blue-700"
        >
          CareerPilot AI
        </Link> */}
        <Logo />

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" end className={navLinkClass}>
            About
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/analyze" className={navLinkClass}>
                Analyze
              </NavLink>

              <NavLink to="/interview" className={navLinkClass}>
                Mock Interview
              </NavLink>

              <NavLink to="/history" className={navLinkClass}>
                History
              </NavLink>

              <span className="px-2 text-sm font-medium text-gray-600">
                {user?.name}
              </span>

              <button
                onClick={logout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${
                    isActive
                      ? "bg-blue-800"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
