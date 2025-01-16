import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActividadesService } from '../actividades/actividades.service';

@Module({
  providers: [ForoService, ActividadesService, PrismaService],
  controllers: [ForoController],
})
export class ForoModule {}