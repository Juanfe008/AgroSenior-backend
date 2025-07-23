import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(username: string, email: string, password: string) {
    return this.usersService.create(username, email, password);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    return { id: user.id, username: user.username };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      userId: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

    await this.mailService.sendPasswordReset(email, token);
    return { message: 'Correo de recuperación enviado' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.usersService.updatePassword(user.id, hashedPassword);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          password: newPassword
        }
      };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
