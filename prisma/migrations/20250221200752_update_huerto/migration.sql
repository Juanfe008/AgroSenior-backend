/*
  Warnings:

  - You are about to drop the column `light` on the `Huerto` table. All the data in the column will be lost.
  - You are about to drop the column `nutrients` on the `Huerto` table. All the data in the column will be lost.
  - You are about to drop the column `water` on the `Huerto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Huerto" DROP COLUMN "light",
DROP COLUMN "nutrients",
DROP COLUMN "water",
ADD COLUMN     "controls" JSONB NOT NULL DEFAULT '[{"light": 50, "water": 50, "nutrients": 50}]',
ADD COLUMN     "simulationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "fruitProductionTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "growthDuration" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "growthStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hasFruits" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastGrowthUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'alive';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- Insertar los datos iniciales en la tabla PlantType
INSERT INTO "PlantType" ("name", "light", "water", "nutrients", "images") VALUES
('Planta 1', 50, 50, 50, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-1.png']),
('Planta 2', 50, 80, 60, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-2.png']),
('Planta 3', 70, 60, 70, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-3.png']);

