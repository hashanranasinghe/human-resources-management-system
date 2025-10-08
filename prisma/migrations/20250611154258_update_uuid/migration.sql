/*
  Warnings:

  - You are about to drop the column `id` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `AttendanceEvent` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `LeaveType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "AttendanceEvent" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "LeaveType" DROP COLUMN "id";
