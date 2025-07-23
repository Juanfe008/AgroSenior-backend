/*
  Warnings:

  - You are about to drop the column `controls` on the `Huerto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Huerto" DROP COLUMN "controls";

-- CreateTable
CREATE TABLE "ControlFila" (
    "id" SERIAL NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "light" INTEGER NOT NULL,
    "water" INTEGER NOT NULL,
    "nutrients" INTEGER NOT NULL,
    "huertoId" INTEGER NOT NULL,

    CONSTRAINT "ControlFila_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ControlFila" ADD CONSTRAINT "ControlFila_huertoId_fkey" FOREIGN KEY ("huertoId") REFERENCES "Huerto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
