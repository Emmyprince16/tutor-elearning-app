-- CreateTable
CREATE TABLE "QuickSession" (
    "id" SERIAL NOT NULL,
    "tutorId" INTEGER NOT NULL,
    "tutorName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuickSession_code_key" ON "QuickSession"("code");

-- CreateIndex
CREATE UNIQUE INDEX "QuickSession_roomId_key" ON "QuickSession"("roomId");
