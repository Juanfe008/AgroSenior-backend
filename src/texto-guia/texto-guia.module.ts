import { Module } from '@nestjs/common';
import { TextoGuiaController } from './texto-guia.controller';
import { TextoGuiaService } from './texto-guia.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
    controllers: [TextoGuiaController],
    providers: [TextoGuiaService, PrismaService],
})
export class TextoGuiaModule {}
