import { Controller, Get } from '@nestjs/common';
import { TextoGuiaService } from './texto-guia.service';

@Controller('texto-guia')
export class TextoGuiaController {
    constructor(private readonly textosGuiasService: TextoGuiaService) {}

    @Get()
    findAll(): string[] {
      return this.textosGuiasService.findAll();
    }
}
