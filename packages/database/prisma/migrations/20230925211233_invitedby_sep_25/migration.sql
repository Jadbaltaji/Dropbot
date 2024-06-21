-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitedByUsername" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitedByUsername_fkey" FOREIGN KEY ("invitedByUsername") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
