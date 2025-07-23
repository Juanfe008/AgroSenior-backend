import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${this.configService.get<string>('RESET_PASSWORD_URL')}${token}`;
    await this.resend.emails.send({
      from: 'noreply@resend.dev', 
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Has solicitado restablecer tu contraseña.</p>
        <p><a href="${resetUrl}">Haz clic aquí para cambiarla</a></p>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });
  }
}
