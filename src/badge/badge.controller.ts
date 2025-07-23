import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './createBadge.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Badge')
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @ApiOperation({ summary: 'Obtener todas las insignias' })
  @Get()
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @ApiOperation({ summary: 'Obtener una insignia por su ID' })
  @ApiParam({ name: 'id', description: 'El ID de la insignia', required: true })
  @Get(':id')
  async getBadgeById(@Param('id', ParseIntPipe) id: number) {
    return this.badgeService.getBadgeById(id);
  }

  @ApiOperation({ summary: 'Crear una nueva insignia' })
  @ApiBody({ description: 'Datos de la insignia a crear', type: CreateBadgeDto })
  @Post()
  async createBadge(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgeService.createBadge(createBadgeDto);
  }

  @ApiOperation({ summary: 'Asignar una insignia a un usuario' })
  @ApiParam({ name: 'userId', description: 'El ID del usuario', required: true })
  @ApiParam({ name: 'badgeId', description: 'El ID de la insignia', required: true })
  @Post(':userId/assign/:badgeId')
  async assignBadgeToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('badgeId', ParseIntPipe) badgeId: number,
  ) {
    return this.badgeService.assignBadgeToUser(userId, badgeId);
  }

  @ApiOperation({ summary: 'Obtener las insignias de un usuario' })
  @ApiParam({ name: 'userId', description: 'El ID del usuario', required: true })
  @Get('user/:userId')
  async getUserBadges(@Param('userId', ParseIntPipe) userId: number) {
    return this.badgeService.getUserBadges(userId);
  }
}