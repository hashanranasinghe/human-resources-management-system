/*
  Warnings:

  - You are about to drop the column `timeIn` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `timeOut` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('TIME_IN', 'TIME_OUT');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "timeIn",
DROP COLUMN "timeOut",
ADD COLUMN     "date" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AttendanceEvent" (
    "id" SERIAL NOT NULL,
    "attendanceId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL,
    "eventTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendanceEvent" ADD CONSTRAINT "AttendanceEvent_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
