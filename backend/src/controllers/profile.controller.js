import prisma from "../lib/prisma.js";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        // ✅ use select instead of include
        id: true,
        username: true,
        email: true,
        createdAt: true,
        solved: {
          include: { question: true },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { question: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const easy = user.solved.filter(
      (s) => s.question.difficulty === "Easy",
    ).length;

    const medium = user.solved.filter(
      (s) => s.question.difficulty === "Medium",
    ).length;

    const hard = user.solved.filter(
      (s) => s.question.difficulty === "Hard",
    ).length;

    const totalSolved = user.solved.length;

    const totalSubmissions = await prisma.submission.count({
      where: { userId: user.id },
    });

    const acceptedSubmissions = await prisma.submission.count({
      where: {
        userId: user.id,
        status: "Accepted",
      },
    });

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2);

    res.json({
      username: user.username,
      totalSolved,
      easy,
      medium,
      hard,
      acceptanceRate,
      recentSubmissions: user.submissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
};
