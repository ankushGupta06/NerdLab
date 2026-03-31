import prisma from "../lib/prisma.js";

export const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { rank: "asc" },
      skip: Number(skip),
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });
  }
};

export const getMyRank = async (req, res) => {
  const userId = req.user.id;

  const data = await prisma.leaderboard.findUnique({
    where: { userId }
  });

  res.json(data);
};