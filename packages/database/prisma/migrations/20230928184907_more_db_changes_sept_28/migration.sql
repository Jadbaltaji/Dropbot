/*
  Warnings:

  - The primary key for the `RouteJob` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `routeId` on the `RouteJob` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `RouteJob` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `RouteJob` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "RouteJob_routeId_key";

-- AlterTable
ALTER TABLE "RouteJob" DROP CONSTRAINT "RouteJob_pkey",
DROP COLUMN "routeId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "percentageComplete" SET DEFAULT 0.0,
ADD CONSTRAINT "RouteJob_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "RouteJob_id_key" ON "RouteJob"("id");
