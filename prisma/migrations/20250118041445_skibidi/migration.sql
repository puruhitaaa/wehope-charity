/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `commentId` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropIndex
DROP INDEX "Like_commentId_key";

-- DropIndex
DROP INDEX "Like_userId_key";

-- DropIndex
DROP INDEX "Transaction_paymentId_idx";

-- DropIndex
DROP INDEX "Transaction_paymentId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "referenceId" TEXT;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "commentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "isSuccess" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "_ArticleToCause" ADD CONSTRAINT "_ArticleToCause_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArticleToCause_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_commentId_key" ON "Like"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "Transaction_id_idx" ON "Transaction"("id");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
