/*
  Warnings:

  - Made the column `departmentId` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "departmentId" SET NOT NULL,
ALTER COLUMN "departmentId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
