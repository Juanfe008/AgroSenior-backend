import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(username: string, email, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        exp: true,
        nivel: true,
        points: true,
        insignias: { // Incluir las insignias del usuario
          select: {
            badge: { // Incluir los detalles de la insignia
              select: {
                id: true,
                nombre: true,
                imagen: true,
                descripcion: true,
              },
            },
            obtenidoEn: true, // Fecha en que se obtuvo la insignia
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserPoints(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true
      }
    });

    if (!user) throw new NotFoundException('User not found');
    return user.points;
  }

  async updateUser(userId: number, data: { username?: string; password?: string }) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Si se proporciona un nuevo nombre de usuario, verificar que no exista
    if (data.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username already exists');
      }
    }

    // Preparar los datos para actualizar
    const updateData: any = {};
    if (data.username) {
      updateData.username = data.username;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Actualizar el usuario
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        exp: true,
        nivel: true,
        points: true,
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        exp: true,
        nivel: true,
        points: true
      }
    });
  }

  async addExp(userId: number, expToAdd: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, exp: true, nivel: true },
    });

    if (!user) throw new NotFoundException('User not found');

    let newExp = user.exp + expToAdd;
    let newNivel = user.nivel;

    // EXP requerido para subir de nivel (ejemplo: 100 EXP por nivel)
    const EXP_POR_NIVEL = 100;

    // Calcula cuántos niveles sube
    const nivelesGanados = Math.floor(newExp / EXP_POR_NIVEL);

    if (nivelesGanados > 0) {
      newNivel += nivelesGanados;
      newExp = newExp % EXP_POR_NIVEL; // Mantiene el excedente para el próximo nivel
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        exp: newExp,
        nivel: newNivel,
      },
      select: {
        id: true,
        username: true,
        nivel: true,
        exp: true,
        points: true,
      },
    });
  }
}
