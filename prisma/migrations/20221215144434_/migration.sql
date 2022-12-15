/*
  Warnings:

  - You are about to drop the column `botStepId` on the `BotAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `nextBotStepId` on the `BotAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `botStepId` on the `BotUserMessage` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `BotUserMessage` table. All the data in the column will be lost.
  - Added the required column `stepId` to the `BotAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `BotUserMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepId` to the `BotUserMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BotAnswer" DROP CONSTRAINT "BotAnswer_botStepId_fkey";

-- DropForeignKey
ALTER TABLE "BotAnswer" DROP CONSTRAINT "BotAnswer_nextBotStepId_fkey";

-- DropForeignKey
ALTER TABLE "BotUserMessage" DROP CONSTRAINT "BotUserMessage_botStepId_fkey";

-- AlterTable
ALTER TABLE "BotAnswer" DROP COLUMN "botStepId",
DROP COLUMN "nextBotStepId",
ADD COLUMN     "nextStepId" TEXT,
ADD COLUMN     "stepId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BotUserMessage" DROP COLUMN "botStepId",
DROP COLUMN "response",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "stepId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BotAnswer" ADD CONSTRAINT "BotAnswer_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "BotStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotAnswer" ADD CONSTRAINT "BotAnswer_nextStepId_fkey" FOREIGN KEY ("nextStepId") REFERENCES "BotStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotUserMessage" ADD CONSTRAINT "BotUserMessage_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "BotStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
