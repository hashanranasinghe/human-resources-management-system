/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_uid_key" ON "Employee"("uid");
