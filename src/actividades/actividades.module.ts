import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { PrismaService } from 'prisma/prisma.service';


@Module({
  providers: [ActividadesService, PrismaService],
  controllers: [ActividadesController]
})
export class ActividadesModule {}
