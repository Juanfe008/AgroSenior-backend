import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeccionModule } from './leccion/leccion.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { ForoModule } from './foro/foro.module';
import { ActividadesModule } from './actividades/actividades.module';
import { HuertoModule } from './huerto/huerto.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, LeccionModule, CuestionarioModule, ForoModule, ActividadesModule, HuertoModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
