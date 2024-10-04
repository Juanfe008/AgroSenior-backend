import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TextoGuiaService } from './texto-guia.service';

@Controller('texto-guia')
export class TextoGuiaController {
    constructor(private readonly textosGuiasService: TextoGuiaService) { }

    @Get()
    findAllGuides() {
        return this.textosGuiasService.findAllGuides();
    }

    @Get(':id') 
    findOneGuide(@Param('id') id: string) {
        return this.textosGuiasService.findOneGuide(+id);
    }

    @Get('nivel/:nivelId') 
    findGuidesByNivel(@Param('nivelId') nivelId: string) {
        return this.textosGuiasService.findGuidesByNivel(+nivelId);
    }

    @Post()
    createGuide(@Body() body: { title: string, desc: string, cards: { title: string, content: string, imageUrl?: string }[], nivelId: number }) {
        return this.textosGuiasService.createGuideWithCards(body.title, body.desc, body.cards, body.nivelId);
    }
}

