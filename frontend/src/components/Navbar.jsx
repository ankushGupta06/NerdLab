import { useNavigate, useLocation } from "react-router-dom";
import { Code2, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="h-16 border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/questions")}
      >
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Code2 className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          NerdLab
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
          {/* Problems */}
          <button
            onClick={() => navigate("/questions")}
            className={`${
              isActive("/questions")
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "hover:text-white"
            } pb-5 pt-5 px-1 transition-colors`}
          >
            Problems
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => navigate("/leaderboard")}
            className={`${
              isActive("/leaderboard")
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "hover:text-white"
            } pb-5 pt-5 px-1 transition-colors`}
          >
            Leaderboard
          </button>

          {/* Contests placeholder */}
          <button className="hover:text-white transition-colors pb-5 pt-5 px-1">
            Contests
          </button>
        </div>

        {isLoggedIn ? (
          <>
            {/* Profile Button */}
            <button
              onClick={() => navigate(`/profile/${username}`)}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-400/10 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-indigo-400/20"
            >
              <User size={16} />
              <span className="hidden sm:inline">{username}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-rose-400/20"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
