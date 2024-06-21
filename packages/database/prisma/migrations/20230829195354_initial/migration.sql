-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User', 'Anonymous');

-- CreateEnum
CREATE TYPE "ONFTService" AS ENUM ('Merkly', 'L2Marathon');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "ONFT" (
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "ONFTservice" "ONFTService" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "ONFT_tokenId_key" ON "ONFT"("tokenId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ONFT" ADD CONSTRAINT "ONFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
