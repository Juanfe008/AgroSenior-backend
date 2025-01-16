import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HuertoService } from './huerto.service';
import { HuertoController } from './huerto.controller';

@Module({
  providers: [PrismaService, HuertoService],
  controllers: [HuertoController],
})
export class HuertoModule {}