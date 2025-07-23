-- AlterTable
ALTER TABLE "Actividad" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "evento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
