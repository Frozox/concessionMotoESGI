-- CreateTable
CREATE TABLE "adminRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestApproverId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adminRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "adminRequest" ADD CONSTRAINT "adminRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminRequest" ADD CONSTRAINT "adminRequest_requestApproverId_fkey" FOREIGN KEY ("requestApproverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
