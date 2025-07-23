/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `Leccion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[infografiaId]` on the table `Leccion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Leccion" DROP COLUMN "imgUrl",
ADD COLUMN     "infografiaId" INTEGER;

-- CreateTable
CREATE TABLE "Infografia" (
    "id" SERIAL NOT NULL,
    "leccionId" INTEGER,
    "backgroundImage" TEXT,

    CONSTRAINT "Infografia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfografiaElemento" (
    "id" SERIAL NOT NULL,
    "infografiaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT,
    "posicionX" INTEGER NOT NULL,
    "posicionY" INTEGER NOT NULL,
    "contenido" JSONB NOT NULL,
    "estilo" JSONB,
    "interactivo" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InfografiaElemento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Infografia_leccionId_key" ON "Infografia"("leccionId");

-- CreateIndex
CREATE INDEX "InfografiaElemento_infografiaId_orden_idx" ON "InfografiaElemento"("infografiaId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "Leccion_infografiaId_key" ON "Leccion"("infografiaId");

-- AddForeignKey
ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_infografiaId_fkey" FOREIGN KEY ("infografiaId") REFERENCES "Infografia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfografiaElemento" ADD CONSTRAINT "InfografiaElemento_infografiaId_fkey" FOREIGN KEY ("infografiaId") REFERENCES "Infografia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
