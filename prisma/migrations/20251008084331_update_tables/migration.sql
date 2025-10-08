/*
  Warnings:

  - The `timeIn` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timeOut` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `position` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `eventTime` on the `AttendanceEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hireDate` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'BREAK_START';
ALTER TYPE "EventType" ADD VALUE 'BREAK_END';

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeIn",
ADD COLUMN     "timeIn" TIMESTAMP(3),
DROP COLUMN "timeOut",
ADD COLUMN     "timeOut" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AttendanceEvent" DROP COLUMN "eventTime",
ADD COLUMN     "eventTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "position",
ADD COLUMN     "positionId" TEXT,
DROP COLUMN "hireDate",
ADD COLUMN     "hireDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "refId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("refId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_refId_key" ON "Position"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_title_key" ON "Position"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("refId") ON DELETE SET NULL ON UPDATE CASCADE;
