import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActividadesService } from '../actividades/actividades.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [ForoService, ActividadesService, PrismaService, CloudinaryService],
  controllers: [ForoController],
})
export class ForoModule {}