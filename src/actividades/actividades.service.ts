import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ActividadesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableActivities(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { nivel: true },
    });

    if (!user) throw new Error('Usuario no encontrado');

    const actividades = await this.prisma.actividad.findMany({
      where: {
        nivelMin: { lte: user.nivel }, 
      },
      include: {
        completadas: {
          where: { userId }, 
        },
      },
    });

    return actividades.map((actividad) => ({
      id: actividad.id,
      title: actividad.title,
      desc: actividad.desc,
      nivelMin: actividad.nivelMin,
      completada: actividad.completadas.length > 0, 
      exp: actividad.exp,
      tipo: actividad.tipo,
    }));
  }

  async createActivity(data: { title: string; desc: string; nivelMin: number, exp: number, tipo: string }) {
    return this.prisma.actividad.create({
      data,
    });
  }

  async completeActivity(userId: number, actividadId: number) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id: actividadId },  
      select: { id: true, exp: true },
    });
  
    if (!actividad) throw new Error('Actividad no encontrada');
  
    const existingActivityCompletion = await this.prisma.actividadCompletada.findFirst({
      where: { userId, actividadId: actividad.id },
    });
  
    if (!existingActivityCompletion) {
      await this.prisma.actividadCompletada.create({
        data: {
          userId,
          actividadId: actividad.id,
        },
      });
  
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          exp: {
            increment: actividad.exp, 
          },
        },
      });
    }
  }  
}
