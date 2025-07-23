import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBadgeDto } from './createBadge.dto';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtener todas las insignias
  async getAllBadges() {
    return this.prisma.badge.findMany();
  }

  // Obtener una insignia por su ID
  async getBadgeById(id: number) {
    return this.prisma.badge.findUnique({
      where: { id },
    });
  }

  // Crear una nueva insignia
  async createBadge(createBadgeDto: CreateBadgeDto) {
    return this.prisma.badge.create({
      data: createBadgeDto,
    });
  }

  // Asignar una insignia a un usuario
  async assignBadgeToUser(userId: number, badgeId: number) {
    return this.prisma.userBadge.create({
      data: {
        userId,
        badgeId,
      },
    });
  }

  // Obtener las insignias de un usuario
  async getUserBadges(userId: number) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }, // Incluir los detalles de la insignia
    });
  }
}