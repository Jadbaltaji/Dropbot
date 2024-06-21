/*
  Warnings:

  - You are about to drop the column `custodialWalletLimit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `importedWalletLimit` on the `User` table. All the data in the column will be lost.
  - Added the required column `walletCount` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "walletCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "custodialWalletLimit",
DROP COLUMN "importedWalletLimit";
