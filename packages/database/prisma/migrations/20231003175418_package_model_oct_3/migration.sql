/*
  Warnings:

  - You are about to drop the column `package` on the `Checkout` table. All the data in the column will be lost.
  - Added the required column `packageId` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('Custodial', 'NonCustodial');

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "package",
ADD COLUMN     "packageId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Package";

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "PackageType" NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_id_key" ON "Package"("id");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
