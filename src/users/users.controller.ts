import { Controller, Get, UseGuards, Request, Body, Patch } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @ApiOperation({ summary: 'Actualizar datos del usuario' })
  @ApiBearerAuth()
  async updateUser(
    @Request() req,
    @Body() updateData: { username?: string; password?: string }
  ) {
    const userId = req.user.userId;
    return await this.usersService.updateUser(userId, updateData);
  }
}
