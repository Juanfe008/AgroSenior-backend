import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ForoService, PrismaService],
  controllers: [ForoController],
})
export class ForoModule {}