/*
  Warnings:

  - You are about to drop the `Checkouts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checkouts" DROP CONSTRAINT "Checkouts_userId_fkey";

-- DropTable
DROP TABLE "Checkouts";

-- CreateTable
CREATE TABLE "Checkout" (
    "chargeID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CheckoutStatus" NOT NULL,
    "package" "Package" NOT NULL,
    "isImported" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("chargeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_chargeID_key" ON "Checkout"("chargeID");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
