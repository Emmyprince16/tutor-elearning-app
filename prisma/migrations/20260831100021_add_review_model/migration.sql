-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "tutorId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_studentId_tutorId_key" ON "Review"("studentId", "tutorId");
