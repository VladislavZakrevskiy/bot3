-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emoji_pack" TEXT[],
ADD COLUMN     "time_notification" TEXT NOT NULL DEFAULT '4 hour';
