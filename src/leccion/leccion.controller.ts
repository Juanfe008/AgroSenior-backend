import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
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

  @Get('nivel/:nivelId/usuario/:userId')
  @ApiOperation({ summary: 'Obtener lecciones por nivel' })
  @ApiParam({ name: 'nivelId', description: 'ID del nivel', example: '2' })
  @ApiParam({ name: 'userId', description: 'ID del usuario', example: '5' })
  findLeccionesByNivel(@Param('nivelId') nivelId: string, @Param('userId') userId: string) {
    return this.leccionService.findLeccionesByNivel(+nivelId, +userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva lección' })
  @ApiBody({ type: CreateLeccionDto })
  createLeccion(@Body() createLeccionDto: CreateLeccionDto) {
    return this.leccionService.createLeccion(createLeccionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una lección existente' })
  @ApiParam({
    name: 'id',
    description: 'ID de la lección a actualizar',
    example: '1',
  })
  @ApiBody({ type: CreateLeccionDto })
  updateLeccion(@Param('id') id: string, @Body() updateLeccionDto: CreateLeccionDto) {
    return this.leccionService.updateLeccion(+id, updateLeccionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una lección' })
  @ApiParam({
    name: 'id',
    description: 'ID de la lección a eliminar',
    example: '1',
  })
  deleteLeccion(@Param('id') id: string) {
    return this.leccionService.deleteLeccion(+id);
  }
}
