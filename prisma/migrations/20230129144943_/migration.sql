-- CreateTable
CREATE TABLE "adminRequestMessage" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adminRequestMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "adminRequestMessage" ADD CONSTRAINT "adminRequestMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "adminRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminRequestMessage" ADD CONSTRAINT "adminRequestMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
