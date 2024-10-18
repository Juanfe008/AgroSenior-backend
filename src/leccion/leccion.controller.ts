import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LeccionService } from './leccion.service';

@Controller('leccion')
export class LeccionController {
    constructor(private readonly leccionService: LeccionService) {}

    @Get()
    findAllLecciones() {
        return this.leccionService.findAllLecciones();
    }

    @Get(':id')
    findOneLeccion(@Param('id') id: string) {
        return this.leccionService.findOneLeccion(+id);
    }

    @Get('nivel/:nivelId')
    findLeccionesByNivel(@Param('nivelId') nivelId: string) {
        return this.leccionService.findLeccionesByNivel(+nivelId);
    }

    @Post()
    createLeccion(@Body() body: {
        title: string;
        desc: string;
        imgUrl?: string; 
        tipo: 'texto' | 'infografia';
        nivelId: number;
        cards?: { title: string; content: string; imageUrl?: string }[]; 
    }) {
        return this.leccionService.createLeccion(body);
    }
}
