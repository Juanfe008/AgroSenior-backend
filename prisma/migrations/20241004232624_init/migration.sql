-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- Insertar los registros de la tabla nivel
INSERT INTO "Nivel" (id) VALUES (1), (2), (3), (4), (5);  

-- CreateTable
CREATE TABLE "TextoGuia" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "nivelId" INTEGER,

    CONSTRAINT "TextoGuia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "guideId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TextoGuia" ADD CONSTRAINT "TextoGuia_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "TextoGuia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
