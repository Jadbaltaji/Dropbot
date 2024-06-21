-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "isImported" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Checkouts" (
    "chargeID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkouts_pkey" PRIMARY KEY ("chargeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Checkouts_chargeID_key" ON "Checkouts"("chargeID");

-- AddForeignKey
ALTER TABLE "Checkouts" ADD CONSTRAINT "Checkouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
