import { Controller, Get , Post, Body } from '@nestjs/common';
import { TextoGuiaService } from './texto-guia.service';

@Controller('texto-guia')
export class TextoGuiaController {
    constructor(private readonly textosGuiasService: TextoGuiaService) {}

    @Get()
  findAllGuides() {
    return this.textosGuiasService.findAllGuides();
  }

  @Post()
  createGuide(@Body() body: { title: string, cards: { title: string, content: string, imageUrl?: string }[] }) {
    return this.textosGuiasService.createGuideWithCards(body.title, body.cards);
  }
}

