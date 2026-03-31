import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

// 🔹 Core logic
async function updateLeaderboard() {
  try {
    console.log("⏳ Updating leaderboard...");

    const scores = await prisma.$queryRaw`
      SELECT sp."userId",
      SUM(
        CASE 
          WHEN q."difficulty" = 'Easy' THEN 10
          WHEN q."difficulty" = 'Medium' THEN 30
          WHEN q."difficulty" = 'Hard' THEN 50
        END
      ) as score
      FROM "SolvedProblem" sp
      JOIN "Question" q ON sp."questionId" = q."id"
      GROUP BY sp."userId"
      ORDER BY score DESC;
    `;

    const ranked = scores.map((u, i) => ({
      userId: u.userId,
      score: Number(u.score),
      rank: i + 1
    }));

    await prisma.leaderboard.deleteMany();

    await prisma.leaderboard.createMany({
      data: ranked
    });

    console.log("✅ Leaderboard updated");
  } catch (err) {
    console.error("❌ Leaderboard update failed:", err);
  }
}

// 🔹 Start cron
export function startLeaderboardCron() {
  // Run every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    await updateLeaderboard();
  });

  // Run once on startup
  updateLeaderboard();
}