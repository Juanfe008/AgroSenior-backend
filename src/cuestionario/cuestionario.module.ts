import { Module } from '@nestjs/common';
import { CuestionarioController } from './cuestionario.controller';
import { CuestionarioService } from './cuestionario.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CuestionarioController],
  providers: [CuestionarioService, PrismaService],
})
export class CuestionarioModule {}
