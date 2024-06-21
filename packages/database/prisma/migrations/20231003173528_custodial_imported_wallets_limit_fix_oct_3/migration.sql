/*
  Warnings:

  - You are about to drop the column `normalWalletLimit` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "normalWalletLimit",
ADD COLUMN     "custodialWalletLimit" INTEGER NOT NULL DEFAULT 0;
