/*
  Warnings:

  - A unique constraint covering the columns `[npm]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "npm" TEXT,
ADD COLUMN     "role" "MemberRole";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_npm_key" ON "Profile"("npm");
