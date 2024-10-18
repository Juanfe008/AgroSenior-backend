import { Module } from '@nestjs/common';
import { LeccionController } from './leccion.controller';
import { LeccionService } from './leccion.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [LeccionController],
  providers: [LeccionService, PrismaService]
})
export class LeccionModule {}