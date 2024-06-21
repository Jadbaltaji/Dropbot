/*
  Warnings:

  - The primary key for the `Checkout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chargeID` on the `Checkout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Checkout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Checkout_chargeID_key";

-- AlterTable
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_pkey",
DROP COLUMN "chargeID",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending',
ADD CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_id_key" ON "Checkout"("id");
