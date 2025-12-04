/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BudgetPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_categoryId_fkey";

-- DropIndex
DROP INDEX "Budget_userId_categoryId_month_year_key";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "categoryId",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "period" "BudgetPeriod" NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_BudgetToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BudgetToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BudgetToCategory_B_index" ON "_BudgetToCategory"("B");

-- CreateIndex
CREATE INDEX "Budget_startDate_idx" ON "Budget"("startDate");

-- CreateIndex
CREATE INDEX "Budget_endDate_idx" ON "Budget"("endDate");

-- AddForeignKey
ALTER TABLE "_BudgetToCategory" ADD CONSTRAINT "_BudgetToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToCategory" ADD CONSTRAINT "_BudgetToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
