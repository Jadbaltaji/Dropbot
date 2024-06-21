/*
  Warnings:

  - You are about to drop the column `invitedByUsername` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `RouteJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exeuctor` to the `RouteJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RouteJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RouteJobExecutor" AS ENUM ('Client', 'Dropbot');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_invitedByUsername_fkey";

-- AlterTable
ALTER TABLE "RouteJob" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exeuctor" "RouteJobExecutor" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "invitedByUsername",
ADD COLUMN     "invitedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
