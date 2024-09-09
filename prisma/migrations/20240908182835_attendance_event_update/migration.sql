/*
  Warnings:

  - You are about to drop the column `date` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `timeIn` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOut` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "date",
ADD COLUMN     "timeIn" TEXT NOT NULL,
ADD COLUMN     "timeOut" TEXT NOT NULL;
