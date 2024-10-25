import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';
import { CreateCuestionarioDto } from './create-cuestionario.dto';

@Controller('cuestionarios')
export class CuestionarioController {
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  @Post()
  create(@Body() createCuestionarioDto: CreateCuestionarioDto) {
    return this.cuestionarioService.create(createCuestionarioDto);
  }

  @Get()
  findAll() {
    return this.cuestionarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuestionarioService.findOne(+id);
  }
}
