-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'Easy',
ADD COLUMN     "topic" TEXT NOT NULL DEFAULT 'General';

-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "input" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
