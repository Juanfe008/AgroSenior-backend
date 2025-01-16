import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HuertoService {
  constructor(private prisma: PrismaService) {}

  async createHuerto(userId: number) {
    return this.prisma.huerto.create({
      data: {
        userId,
      },
    });
  }

  async getHuertoByUserId(userId: number) {
    return this.prisma.huerto.findUnique({
      where: { userId },
      include: {
        plants: {
          include: {
            type: true, 
          },
        },
      },
    });
  }

  async updateControls(userId: number, controls: { light: number; water: number; nutrients: number }) {
    return this.prisma.huerto.update({
      where: { userId },
      data: controls,
    });
  }

  async plantSeed(userId: number, type: string, positionX: number, positionY: number) {
    const huerto = await this.prisma.huerto.findUnique({ where: { userId } });
    if (!huerto) throw new Error('Huerto not found');
  
    // Buscar el tipo de planta según el nombre
    const plantType = await this.prisma.plantType.findUnique({
      where: { name: type },
    });
  
    if (!plantType) throw new Error('Plant type not found');
  
    return this.prisma.plant.create({
      data: {
        huertoId: huerto.id,
        plantTypeId: plantType.id,  // Asociar el tipo de planta
        positionX,
        positionY,
      },
    });
  }

  async updatePlantGrowth(plantId: number, growthStage: number, plantHealth: number) {
    return this.prisma.plant.update({
      where: { id: plantId },
      data: {
        growthStage,
        plantHealth,
      },
    });
  }

  async removePlant(plantId: number) {
    return this.prisma.plant.delete({ where: { id: plantId } });
  }
}