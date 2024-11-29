import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
