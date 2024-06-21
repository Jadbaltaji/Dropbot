-- AlterTable
ALTER TABLE "User" ADD COLUMN     "importedWalletLimit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "normalWalletLimit" INTEGER NOT NULL DEFAULT 0;
