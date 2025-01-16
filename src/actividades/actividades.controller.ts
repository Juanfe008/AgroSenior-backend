import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ActividadesService } from './actividades.service';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Get('disponibles/:userId')
  async getAvailableActivities(@Param('userId') userId: string) {
    return this.actividadesService.getAvailableActivities(Number(userId));
  }

  @Post('crear')
  async createActivity(
    @Body() body: { title: string; desc: string; nivelMin: number, exp: number, tipo: string },
  ) {
    const { title, desc, nivelMin, exp, tipo } = body;
    return this.actividadesService.createActivity({ title, desc, nivelMin, exp, tipo});
  }

  @Post('completar')
  async completeActivity(
    @Body() body: { userId: number; actividadId: number },
  ) {
    const { userId, actividadId } = body;
    return this.actividadesService.completeActivity(userId, actividadId);
  }
}
