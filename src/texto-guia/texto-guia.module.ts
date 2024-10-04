import { Module } from '@nestjs/common';
import { TextoGuiaController } from './texto-guia.controller';
import { TextoGuiaService } from './texto-guia.service';

@Module({
    controllers: [TextoGuiaController],
    providers: [TextoGuiaService],
})
export class TextoGuiaModule {}
