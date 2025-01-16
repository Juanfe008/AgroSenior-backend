-- CreateTable para Cuestionario
CREATE TABLE "Cuestionario" (
    "id" SERIAL NOT NULL,
    CONSTRAINT "Cuestionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Nivel
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- Insertar los registros de la tabla nivel
INSERT INTO "Nivel" (id) VALUES (1), (2), (3), (4), (5);  

-- CreateTable para Leccion
CREATE TABLE "Leccion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "imgUrl" TEXT,
    "tipo" TEXT NOT NULL,
    "nivelId" INTEGER,
    "cuestionarioId" INTEGER, 
    CONSTRAINT "Leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Card
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "leccionId" INTEGER NOT NULL,
    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable para User
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,          
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Pregunta
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "cuestionarioId" INTEGER NOT NULL,
    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Opcion
CREATE TABLE "Opcion" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable para CuestionarioCompletado
CREATE TABLE "CuestionarioCompletado" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cuestionarioId" INTEGER NOT NULL,
    "completadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CuestionarioCompletado_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Post
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "parentPostId" INTEGER,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable para PostLike
CREATE TABLE "PostLike" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable para Actividad
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "nivelMin" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 10,
    "tipo" TEXT NOT NULL DEFAULT 'virtual',
    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable para ActividadCompletada
CREATE TABLE "ActividadCompletada" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "completadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActividadCompletada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Huerto" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "light" INTEGER NOT NULL DEFAULT 50,
    "water" INTEGER NOT NULL DEFAULT 50,
    "nutrients" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Huerto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "light" INTEGER NOT NULL,
    "water" INTEGER NOT NULL,
    "nutrients" INTEGER NOT NULL,
    "images" TEXT[],

    CONSTRAINT "PlantType_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "PlantType_name_key" ON "PlantType"("name");

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "huertoId" INTEGER NOT NULL,
    "plantTypeId" INTEGER NOT NULL,
    "growthStage" INTEGER NOT NULL DEFAULT 0,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "plantHealth" INTEGER NOT NULL DEFAULT 100,
    "plantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastWatered" TIMESTAMP(3),
    "lastHarvested" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- Índices y Claves Foráneas

-- Índices únicos para User
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Índice único para Leccion
CREATE UNIQUE INDEX "Leccion_cuestionarioId_key" ON "Leccion"("cuestionarioId");

-- Índice único para CuestionarioCompletado
CREATE UNIQUE INDEX "CuestionarioCompletado_userId_cuestionarioId_key" ON "CuestionarioCompletado"("userId", "cuestionarioId");

-- Índice único para PostLike
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");

-- Índice único para ActividadCompletada
CREATE UNIQUE INDEX "ActividadCompletada_userId_actividadId_key" ON "ActividadCompletada"("userId", "actividadId");

-- Índice único para Huerto
CREATE UNIQUE INDEX "Huerto_userId_key" ON "Huerto"("userId");

-- Foreign Key para Leccion -> Nivel y Cuestionario
ALTER TABLE "Leccion" 
    ADD CONSTRAINT "Leccion_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Leccion" 
    ADD CONSTRAINT "Leccion_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "Cuestionario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Foreign Key para Card -> Leccion
ALTER TABLE "Card" 
    ADD CONSTRAINT "Card_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "Leccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para Pregunta -> Cuestionario
ALTER TABLE "Pregunta" 
    ADD CONSTRAINT "Pregunta_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "Cuestionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para Opcion -> Pregunta
ALTER TABLE "Opcion" 
    ADD CONSTRAINT "Opcion_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para CuestionarioCompletado -> User y Cuestionario
ALTER TABLE "CuestionarioCompletado" 
    ADD CONSTRAINT "CuestionarioCompletado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CuestionarioCompletado" 
    ADD CONSTRAINT "CuestionarioCompletado_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "Cuestionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para Post -> User y Post (parentPostId)
ALTER TABLE "Post" 
    ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Post" 
    ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para PostLike -> Post y User
ALTER TABLE "PostLike" 
    ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostLike" 
    ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key para ActividadCompletada -> User y Actividad
ALTER TABLE "ActividadCompletada" 
    ADD CONSTRAINT "ActividadCompletada_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActividadCompletada" 
    ADD CONSTRAINT "ActividadCompletada_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Huerto" ADD CONSTRAINT "Huerto_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_huertoId_fkey" 
FOREIGN KEY ("huertoId") REFERENCES "Huerto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_plantTypeId_fkey" 
FOREIGN KEY ("plantTypeId") REFERENCES "PlantType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insertar los datos iniciales en la tabla PlantType
INSERT INTO "PlantType" ("name", "light", "water", "nutrients", "images") VALUES
('Planta 1', 50, 50, 50, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-1.png']),
('Planta 2', 50, 80, 60, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-2.png']),
('Planta 3', 70, 60, 70, ARRAY['/images/huerto/maceta-semilla.png', '/images/huerto/maceta-semilla.png', '/images/huerto/Maceta-planta-3.png']);
