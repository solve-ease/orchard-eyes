/*
  Warnings:

  - You are about to drop the column `disease` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `pests` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `yield` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `detected_diseases` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organ_counts` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "disease",
DROP COLUMN "pests",
DROP COLUMN "yield",
ADD COLUMN     "detected_diseases" JSONB NOT NULL,
ADD COLUMN     "organ_counts" JSONB NOT NULL;
