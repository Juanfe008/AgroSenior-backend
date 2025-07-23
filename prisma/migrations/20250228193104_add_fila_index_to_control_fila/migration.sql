/*
  Warnings:

  - You are about to drop the column `rowIndex` on the `ControlFila` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[huertoId,filaIndex]` on the table `ControlFila` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filaIndex` to the `ControlFila` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ControlFila" DROP COLUMN "rowIndex",
ADD COLUMN     "filaIndex" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ControlFila_huertoId_filaIndex_key" ON "ControlFila"("huertoId", "filaIndex");
