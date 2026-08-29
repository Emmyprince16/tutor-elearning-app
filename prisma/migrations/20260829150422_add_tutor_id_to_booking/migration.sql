/*
  Warnings:

  - Added the required column `tutorId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "tutorId" INTEGER NOT NULL;
