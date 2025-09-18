/*
  Warnings:

  - You are about to drop the column `stageId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_stageId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "stageId";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
