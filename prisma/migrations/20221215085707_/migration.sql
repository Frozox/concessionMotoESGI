-- CreateTable
CREATE TABLE "BotStep" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotAnswer" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "botStepId" TEXT NOT NULL,
    "nextBotStepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotUserMessage" (
    "id" TEXT NOT NULL,
    "botStepId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotUserMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotAnswer" ADD CONSTRAINT "BotAnswer_botStepId_fkey" FOREIGN KEY ("botStepId") REFERENCES "BotStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotAnswer" ADD CONSTRAINT "BotAnswer_nextBotStepId_fkey" FOREIGN KEY ("nextBotStepId") REFERENCES "BotStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotUserMessage" ADD CONSTRAINT "BotUserMessage_botStepId_fkey" FOREIGN KEY ("botStepId") REFERENCES "BotStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
