-- CreateEnum
CREATE TYPE "Levels" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "themes" TEXT[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "day" (
    "day_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "day_pkey" PRIMARY KEY ("day_id")
);

-- CreateTable
CREATE TABLE "note" (
    "note_id" TEXT NOT NULL,
    "mood" "Levels" NOT NULL,
    "experience" TEXT NOT NULL,
    "themes" TEXT[],
    "day_id" TEXT,

    CONSTRAINT "note_pkey" PRIMARY KEY ("note_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "day_day_id_key" ON "day"("day_id");

-- CreateIndex
CREATE UNIQUE INDEX "note_note_id_key" ON "note"("note_id");

-- AddForeignKey
ALTER TABLE "day" ADD CONSTRAINT "day_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("day_id") ON DELETE SET NULL ON UPDATE CASCADE;
