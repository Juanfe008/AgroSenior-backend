import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeccionModule } from './leccion/leccion.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { ForoModule } from './foro/foro.module';

@Module({
  imports: [AuthModule, UsersModule, LeccionModule, CuestionarioModule, ForoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
