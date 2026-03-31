-- CreateTable
CREATE TABLE "Leaderboard" (
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "Leaderboard_score_idx" ON "Leaderboard"("score");

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
