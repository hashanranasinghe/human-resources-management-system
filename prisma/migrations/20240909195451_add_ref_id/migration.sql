/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AttendanceEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `AttendanceEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refId` to the `AttendanceEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceEvent" DROP CONSTRAINT "AttendanceEvent_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_managerId_fkey";

-- DropIndex
DROP INDEX "Employee_uid_key";

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
ADD COLUMN     "refId" TEXT NOT NULL,
ALTER COLUMN "employeeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("refId");

-- AlterTable
ALTER TABLE "AttendanceEvent" DROP CONSTRAINT "AttendanceEvent_pkey",
ADD COLUMN     "refId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AttendanceEvent_pkey" PRIMARY KEY ("refId");

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
ADD COLUMN     "refId" TEXT NOT NULL,
ALTER COLUMN "managerId" SET DATA TYPE TEXT,
ALTER COLUMN "creatorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("refId");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "uid",
ADD COLUMN     "refId" TEXT NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_refId_key" ON "Attendance"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceEvent_refId_key" ON "AttendanceEvent"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_refId_key" ON "Department"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_refId_key" ON "Employee"("refId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Employee"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEvent" ADD CONSTRAINT "AttendanceEvent_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
