/*
  Warnings:

  - Added the required column `evento` to the `Actividad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actividad" ADD COLUMN     "evento" TEXT NOT NULL;
