/*
  Warnings:

  - You are about to drop the column `status` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "RouteJob" (
    "routeId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "percentageComplete" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Idle',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteJob_pkey" PRIMARY KEY ("routeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RouteJob_routeId_key" ON "RouteJob"("routeId");

-- AddForeignKey
ALTER TABLE "RouteJob" ADD CONSTRAINT "RouteJob_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
