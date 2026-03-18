import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();

        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">User</th>
              <th className="p-4">Score</th>
              <th className="p-4">Easy</th>
              <th className="p-4">Medium</th>
              <th className="p-4">Hard</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((user) => (
              <tr
                key={user.rank}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold">{user.rank}</td>

                <td className="p-4 text-blue-600 font-medium">
                  {user.username}
                </td>

                <td className="p-4 font-semibold">{user.score}</td>

                <td className="p-4 text-green-600">{user.easy}</td>

                <td className="p-4 text-yellow-600">{user.medium}</td>

                <td className="p-4 text-red-600">{user.hard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;