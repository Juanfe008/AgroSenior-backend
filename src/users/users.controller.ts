import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) 
  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' }) 
  @ApiBearerAuth() 
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    return await this.usersService.findById(userId);
  }
}
