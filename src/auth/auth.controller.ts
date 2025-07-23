import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestResetDto } from './request-reset.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'johndoe@example.com' },
        password: { type: 'string', example: 'securePassword123' },
      },
    },
  })
  async register(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con un usuario existente' })
  @ApiBody({
    description: 'Credenciales para iniciar sesión',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        password: { type: 'string', example: 'securePassword123' },
      },
    },
  })

  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiBody({
    description: 'Correo electrónico para solicitar recuperación de contraseña',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'johndoe@example.com' },
      },
    },
  })
  async requestPasswordReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer la contraseña' })
  @ApiBody({
    description: 'Token de recuperación y nueva contraseña',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'resetToken123' },
        newPassword: { type: 'string', example: 'newSecurePassword123' },
      },
    },
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
