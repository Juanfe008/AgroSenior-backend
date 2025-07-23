import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CuestionarioService } from './cuestionario.service';
import { CreateCuestionarioDto, CreateCuestionarioCompletadoDto } from './cuestionario.dto';

@ApiTags('Cuestionarios') 
@Controller('cuestionarios')
export class CuestionarioController {
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cuestionario' }) 
  @ApiBody({
    description: 'Datos necesarios para crear un cuestionario',
    type: CreateCuestionarioDto,
  })
  create(@Body() createCuestionarioDto: CreateCuestionarioDto) {
    return this.cuestionarioService.create(createCuestionarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los cuestionarios disponibles' }) 
  findAll() {
    return this.cuestionarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cuestionario por su ID' }) 
  @ApiParam({
    name: 'id',
    description: 'ID del cuestionario a buscar',
    example: '1',
  })
  findOne(@Param('id') id: string) {
    return this.cuestionarioService.findOne(+id);
  }

  @Post('completar')
  @ApiOperation({ summary: 'Registrar un cuestionario completado' }) 
  @ApiBody({
    description: 'Datos necesarios para registrar un cuestionario completado',
    type: CreateCuestionarioCompletadoDto,
  })
  async registrarCuestionarioCompletado(
    @Body() data: CreateCuestionarioCompletadoDto,
  ) {
    return this.cuestionarioService.registrarCuestionarioCompletado(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cuestionario existente' })
  @ApiParam({
    name: 'id', 
    description: 'ID del cuestionario a actualizar',
    example: '1',
  })
  @ApiBody({
    description: 'Datos para actualizar el cuestionario',
    type: CreateCuestionarioDto,
  })
  update(@Param('id') id: string, @Body() updateCuestionarioDto: CreateCuestionarioDto) {
    return this.cuestionarioService.update(+id, updateCuestionarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cuestionario' })
  @ApiParam({
    name: 'id',
    description: 'ID del cuestionario a eliminar',
    example: '1',
  })
  remove(@Param('id') id: string) {
    return this.cuestionarioService.remove(+id);
  }
}
