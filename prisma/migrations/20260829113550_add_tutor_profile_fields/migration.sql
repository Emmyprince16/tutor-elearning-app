-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "option" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN     "subject" TEXT;
