/*
  Warnings:

  - Added the required column `time` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note" ADD COLUMN     "time" TEXT NOT NULL;
