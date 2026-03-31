import { useEffect, useState } from "react";
import API from "../api/api";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard"); // ✅ SAME STYLE
      setLeaderboard(res.data.data); // ⚠️ matches backend
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-slate-400">
        Loading leaderboard...
      </div>
    );
  }

  if (!leaderboard.length) {
    return (
      <div className="text-center mt-10 text-slate-500">
        No leaderboard data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-extrabold text-white mb-6">
          🏆 Leaderboard
        </h1>

        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">User</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-slate-800 hover:bg-[#243147] transition"
                >
                  {/* Rank + Medal */}
                  <td className="p-4 font-semibold">
                    {user.rank === 1
                      ? "🥇"
                      : user.rank === 2
                      ? "🥈"
                      : user.rank === 3
                      ? "🥉"
                      : user.rank}
                  </td>

                  {/* Username */}
                  <td className="p-4 text-indigo-400 font-medium">
                    {user.user?.username || "Anonymous"}
                  </td>

                  {/* Score */}
                  <td className="p-4 font-semibold text-white">
                    {user.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}