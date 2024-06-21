/*
  Warnings:

  - Added the required column `isImported` to the `Checkouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package` to the `Checkouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Checkouts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('Pending', 'Success', 'Failed');

-- CreateEnum
CREATE TYPE "Package" AS ENUM ('package1', 'package2', 'package3');

-- AlterTable
ALTER TABLE "Checkouts" ADD COLUMN     "isImported" BOOLEAN NOT NULL,
ADD COLUMN     "package" "Package" NOT NULL,
ADD COLUMN     "status" "CheckoutStatus" NOT NULL;
