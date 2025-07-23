import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActividadListener } from './actividades.listener';


@Module({
  providers: [ActividadesService, PrismaService, ActividadListener],
  controllers: [ActividadesController]
})
export class ActividadesModule {}
