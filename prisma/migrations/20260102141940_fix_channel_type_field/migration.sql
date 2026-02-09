/*
  Warnings:

  - You are about to drop the column `typpe` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "typpe",
ADD COLUMN     "type" "ChannelType" NOT NULL DEFAULT 'TEXT';
