import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextoGuiaController } from './texto-guia/texto-guia.controller';
import { TextoGuiaService } from './texto-guia/texto-guia.service';
import { TextoGuiaModule } from './texto-guia/texto-guia.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [TextoGuiaModule],
  controllers: [AppController, TextoGuiaController],
  providers: [AppService, TextoGuiaService, PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
