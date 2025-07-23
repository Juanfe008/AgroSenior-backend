import { Module } from '@nestjs/common';
import { CuestionarioController } from './cuestionario.controller';
import { CuestionarioService } from './cuestionario.service';
import { PrismaService } from 'prisma/prisma.service';
import { ActividadesService } from '../actividades/actividades.service';
import { UsersService} from 'src/users/users.service'

@Module({
  controllers: [CuestionarioController],
  providers: [CuestionarioService, PrismaService, ActividadesService, UsersService],
})
export class CuestionarioModule {}
