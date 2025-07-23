import { 
  Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, 
  BadRequestException
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Actividades')
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener actividades disponibles para el usuario autenticado' })
  @Get('disponibles/:userId')
  async getAvailableActivities(@Param('userId') userId: string) {
    return this.actividadesService.getAvailableActivities(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva actividad (protegido)' })
  @Post('crear')
  async createActivity(
    @Body() body: { title: string; desc: string; nivelMin: number, exp: number, tipo: string, evento: string },
  ) {
    const { title, desc, nivelMin, exp, tipo, evento } = body;
    return this.actividadesService.createActivity({ title, desc, nivelMin, exp, tipo, evento });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Completar una actividad para el usuario autenticado' })
  @Post('completar')
  async completeActivity(
    @Body() body: { userId: number; actividadId: number },
  ) {
    const { userId, actividadId } = body;
    return this.actividadesService.completeActivity(userId, actividadId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una actividad existente (protegido)' })
  @Patch(':id')
  async updateActivity(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; desc: string; nivelMin: number, exp: number, tipo: string, evento: string }>
  ) {
    return this.actividadesService.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una actividad existente (protegido)' })
  @Delete(':id')
  async removeActivity(@Param('id') id: string) {
    return this.actividadesService.remove(Number(id));
  }

  @ApiOperation({ summary: 'Obtener todas las actividades disponibles (público)' })
  @Get()
  async findAll() {
    return this.actividadesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una actividad específica por ID (público)' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('El id debe ser un número válido');
    }
    return this.actividadesService.findOne(idNum);
  }
}
