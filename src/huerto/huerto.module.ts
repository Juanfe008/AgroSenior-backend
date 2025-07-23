import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HuertoService } from './huerto.service';
import { HuertoController } from './huerto.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [PrismaService, HuertoService, UsersService],
  controllers: [HuertoController],
})
export class HuertoModule {}