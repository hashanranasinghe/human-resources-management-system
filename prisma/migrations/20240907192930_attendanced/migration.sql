/*
  Warnings:

  - You are about to drop the column `date` on the `Attendance` table. All the data in the column will be lost.
  - Made the column `timeOut` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "date",
ALTER COLUMN "timeIn" SET DATA TYPE TEXT,
ALTER COLUMN "timeOut" SET NOT NULL,
ALTER COLUMN "timeOut" SET DATA TYPE TEXT;
