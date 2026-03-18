import prisma from "../lib/prisma.js";

export const getLeaderboard = async (req, res) => {
  try {

    const users = await prisma.user.findMany({
      include: {
        solved: {
          include: {
            question: true,
          },
        },
      },
    });

    const leaderboard = users.map((user) => {

      const easy = user.solved.filter(
        (s) => s.question.difficulty === "Easy"
      ).length;

      const medium = user.solved.filter(
        (s) => s.question.difficulty === "Medium"
      ).length;

      const hard = user.solved.filter(
        (s) => s.question.difficulty === "Hard"
      ).length;

      const score = easy * 1 + medium * 3 + hard * 5;

      return {
        username: user.username,
        easy,
        medium,
        hard,
        score,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    const ranked = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    res.json({
      success: true,
      leaderboard: ranked,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch leaderboard",
    });
  }
};