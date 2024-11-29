import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LeccionService } from './leccion.service';
import { CreateLeccionDto } from './leccion.dto';

@ApiTags('Leccion')
@Controller('leccion')
export class LeccionController {
  constructor(private readonly leccionService: LeccionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las lecciones' })
  findAllLecciones() {
    return this.leccionService.findAllLecciones();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lección por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la lección',
    example: '1',
  })
  findOneLeccion(@Param('id') id: string) {
    return this.leccionService.findOneLeccion(+id);
  }

  @Get('nivel/:nivelId')
  @ApiOperation({ summary: 'Obtener lecciones por nivel' })
  @ApiParam({
    name: 'nivelId',
    description: 'ID del nivel al que pertenecen las lecciones',
    example: '2',
  })
  findLeccionesByNivel(@Param('nivelId') nivelId: string) {
    return this.leccionService.findLeccionesByNivel(+nivelId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva lección' })
  @ApiBody({ type: CreateLeccionDto })
  createLeccion(@Body() createLeccionDto: CreateLeccionDto) {
    return this.leccionService.createLeccion(createLeccionDto);
  }
}
