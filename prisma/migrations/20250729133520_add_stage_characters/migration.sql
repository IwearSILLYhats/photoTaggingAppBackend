/*
  Warnings:

  - Added the required column `stageId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage_id` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "stageId" INTEGER NOT NULL,
ADD COLUMN     "stage_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
