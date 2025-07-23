import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class HuertoService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService
    ) { }

    // Obtener todos los tipos de plantas
    async getAllPlantTypes() {
        return this.prisma.plantType.findMany();
    }

    // Obtener un tipo de planta por ID
    async getPlantTypeById(id: number) {
        const plantType = await this.prisma.plantType.findUnique({
            where: { id }
        });

        if (!plantType) {
            throw new NotFoundException('Tipo de planta no encontrado');
        }

        return plantType;
    }

    // Crear un nuevo tipo de planta
    async createPlantType(data: {
        name: string;
        light: number;
        water: number;
        nutrients: number;
        growthDuration: number;
        images: string[];
        precio: number;
    }) {
        return this.prisma.plantType.create({
            data
        });
    }

    // Actualizar un tipo de planta
    async updatePlantType(id: number, data: {
        name?: string;
        light?: number;
        water?: number;
        nutrients?: number;
        growthDuration?: number;
        images?: string[];
        precio?: number;
    }) {
        const plantType = await this.prisma.plantType.findUnique({
            where: { id }
        });

        if (!plantType) {
            throw new NotFoundException('Tipo de planta no encontrado');
        }

        return this.prisma.plantType.update({
            where: { id },
            data
        });
    }

    // Eliminar un tipo de planta
    async deletePlantType(id: number) {
        const plantType = await this.prisma.plantType.findUnique({
            where: { id }
        });

        if (!plantType) {
            throw new NotFoundException('Tipo de planta no encontrado');
        }

        return this.prisma.plantType.delete({
            where: { id }
        });
    }

    // Obtener el catálogo de plantas disponibles
    async getPlantCatalog() {
        return this.prisma.plantType.findMany({
            select: {
                id: true,
                name: true,
                light: true,
                water: true,
                nutrients: true,
                growthDuration: true,
                images: true,
                precio: true
            }
        });
    }

    // Crear un huerto para un usuario
    async createHuerto(userId: number) {
        // Verificar si el usuario existe
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('El usuario no existe');
        }

        // Crear el huerto con 5 filas por defecto
        return this.prisma.huerto.create({
            data: {
                userId,
                controls: {
                    create: Array.from({ length: 5 }, (_, index) => ({
                        filaIndex: index, // Índice de la fila (0, 1, 2, 3, 4)
                        light: 50,
                        water: 50,
                        nutrients: 50,
                    })),
                },
            },
            include: {
                controls: true, // Incluir los controles creados
            },
        });
    }

    // Obtener el huerto de un usuario con sus plantas
    async getHuertoByUserId(userId: number) {
        return this.prisma.huerto.findUnique({
            where: { userId },
            include: {
                plants: {
                    include: {
                        type: true, // Incluir el tipo de planta
                    },
                },
                controls: true, // Incluir los controles del huerto
            },
        });
    }

    // Obtener los puntos de un usuario
    async getUserPoints(userId: number) {
        return this.usersService.getUserPoints(userId);
    }

    // Actualizar los controles de una fila específica
    async updateControls(userId: number, filaIndex: number, controls: { light: number; water: number; nutrients: number }) {
        // Buscar el huerto del usuario
        const huerto = await this.prisma.huerto.findUnique({
            where: { userId },
            include: { controls: true }, // Incluir los controles existentes
        });

        if (!huerto) {
            throw new Error('Huerto no encontrado');
        }

        // Buscar la fila específica
        const filaExistente = huerto.controls.find((f) => f.filaIndex === filaIndex);

        if (filaExistente) {
            // Si la fila ya existe, actualizamos sus valores
            return this.prisma.controlFila.update({
                where: { id: filaExistente.id },
                data: {
                    light: controls.light,
                    water: controls.water,
                    nutrients: controls.nutrients,
                },
            });
        } else {
            // Si la fila no existe, la creamos
            return this.prisma.controlFila.create({
                data: {
                    filaIndex, // Asegúrate de incluir el filaIndex aquí
                    light: controls.light,
                    water: controls.water,
                    nutrients: controls.nutrients,
                    huerto: { connect: { id: huerto.id } }, // Relacionar con el huerto
                },
            });
        }
    }

    // Plantar una semilla en una posición específica
    async plantSeed(userId: number, plantTypeId: number, positionX: number, positionY: number) {
        // Verificar si el huerto existe
        const huerto = await this.prisma.huerto.findUnique({
            where: { userId },
        });

        if (!huerto) {
            throw new NotFoundException('Huerto no encontrado');
        }

        // Verificar si el tipo de planta existe
        const plantType = await this.prisma.plantType.findUnique({
            where: { id: plantTypeId },
        });

        if (!plantType) {
            throw new NotFoundException('Tipo de planta no encontrado');
        }

        // Verificar si el usuario tiene suficientes puntos para comprar la planta
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (user.points < plantType.precio) {
            throw new BadRequestException('No tienes suficientes puntos para comprar esta planta');
        }

        // Verificar si la posición ya está ocupada
        const existingPlant = await this.prisma.plant.findFirst({
            where: {
                huertoId: huerto.id,
                positionX,
                positionY,
            },
        });

        if (existingPlant) {
            throw new ConflictException('La posición ya está ocupada por otra planta');
        }

        // Descontar los puntos del usuario
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                points: { decrement: plantType.precio }, // Restar el precio de la planta
            },
        });

        // Crear la planta
        return this.prisma.plant.create({
            data: {
                huerto: { connect: { id: huerto.id } },
                type: { connect: { id: plantTypeId } }, // Relacionar con el tipo de planta
                positionX,
                positionY,
                growthStage: 0, // Etapa de crecimiento inicial
                plantHealth: 100, // Salud inicial
                growthStartTime: new Date(), // Momento en que la planta comenzó a crecer
                lastGrowthUpdate: new Date(), // Última vez que se actualizó el crecimiento
                growthDuration: plantType.growthDuration, // Duración del crecimiento del tipo de planta
                fruitProductionTime: 0, // Tiempo de producción de frutos inicial
                hasFruits: false, // Sin frutos inicialmente
                status: 'alive', // Estado inicial
                plantedAt: new Date(), // Fecha de siembra
            },
            include: {
                type: true, // Incluir el tipo de planta en la respuesta
            },
        });
    }

    // Actualizar el crecimiento de una planta (automáticamente basado en el tiempo)
    async updatePlantGrowth(plantId: number) {
        // Buscar la planta por su ID
        const plant = await this.prisma.plant.findUnique({
            where: { id: plantId },
            include: { type: true }, // Incluir el tipo de planta para obtener growthDuration
        });

        if (!plant) {
            throw new NotFoundException('Planta no encontrada');
        }

        // Calcular el tiempo transcurrido desde el último crecimiento
        const now = new Date();
        const lastUpdate = plant.lastGrowthUpdate;
        const timeDiff = now.getTime() - lastUpdate.getTime(); // Diferencia en milisegundos
        const minutesDiff = timeDiff / (1000 * 60); // Convertir a minutos

        // Calcular cuántas etapas han pasado
        const stagesPassed = Math.floor(minutesDiff / plant.type.growthDuration);

        if (stagesPassed > 0) {
            // Calcular la nueva etapa de crecimiento
            const newGrowthStage = plant.growthStage + stagesPassed;

            // Determinar si la planta ha alcanzado la etapa final
            const isFinalStage = newGrowthStage >= 3; // Suponiendo que hay 3 etapas de crecimiento

            // Actualizar la planta
            const updatedPlant = await this.prisma.plant.update({
                where: { id: plantId },
                data: {
                    growthStage: isFinalStage ? 3 : newGrowthStage, // No superar la etapa final
                    lastGrowthUpdate: now, // Actualizar la última vez que se actualizó el crecimiento
                    hasFruits: isFinalStage, // La planta tiene frutos solo en la etapa final
                    fruitProductionTime: isFinalStage ? 0 : plant.fruitProductionTime, // Reiniciar si es la etapa final
                    status: isFinalStage ? 'ready' : plant.status, // Cambiar el estado si es necesario
                },
                include: {
                    type: true, // Incluir el tipo de planta en la respuesta
                },
            });

            return updatedPlant;
        } else {
            // Si no ha completado el crecimiento, devolver la planta sin cambios
            return plant;
        }
    }

    // Eliminar una planta
    async removePlant(plantId: number) {
        // Verificar si la planta existe
        const plant = await this.prisma.plant.findUnique({
            where: { id: plantId },
        });

        if (!plant) {
            throw new NotFoundException('Planta no encontrada');
        }

        // Eliminar la planta
        return this.prisma.plant.delete({
            where: { id: plantId },
        });
    }

    // Cosechar frutos de una planta
    async harvestFruits(plantId: number) {
        // Buscar la planta por su ID
        const plant = await this.prisma.plant.findUnique({
            where: { id: plantId },
            include: { huerto: { include: { user: true } } }, // Incluir el huerto y el usuario dueño
        });

        // Verificar si la planta existe
        if (!plant) {
            throw new NotFoundException('Planta no encontrada');
        }

        // Verificar si la planta tiene frutos
        if (!plant.hasFruits) {
            throw new BadRequestException('No hay frutos para cosechar');
        }

        // Obtener el usuario dueño del huerto
        const user = plant.huerto.user;
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Definir la cantidad de puntos a otorgar por cosecha
        const pointsToAdd = 10;

        // Actualizar la planta y los puntos del usuario en una transacción
        const [updatedPlant, updatedUser] = await this.prisma.$transaction([
            this.prisma.plant.update({
                where: { id: plantId },
                data: {
                    hasFruits: false, // Indicar que ya no tiene frutos
                    fruitProductionTime: 0, // Reiniciar el tiempo de producción de frutos
                    lastHarvested: new Date(), // Registrar la última cosecha
                },
            }),
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    points: { increment: pointsToAdd }, // Sumar puntos al usuario
                },
            }),
        ]);

        // Devolver la planta actualizada y un mensaje de éxito
        return {
            message: `Frutos cosechados exitosamente. Se añadieron ${pointsToAdd} puntos.`,
            plant: updatedPlant,
            user: {
                id: updatedUser.id,
                points: updatedUser.points,
            },
        };
    }

    async updatePlantHealth(plantId: number, plantHealth: number): Promise<any> {
        // Verificar si la planta existe
        const plant = await this.prisma.plant.findUnique({
            where: { id: plantId },
        });

        if (!plant) {
            throw new NotFoundException('Planta no encontrada');
        }

        // Actualizar la salud de la planta
        return this.prisma.plant.update({
            where: { id: plantId },
            data: {
                plantHealth, // Actualizar la salud
            },
        });
    }

    async killPlant(plantId: number) {
        // Buscar la planta por su ID
        const plant = await this.prisma.plant.findUnique({
            where: { id: plantId },
        });

        if (!plant) {
            throw new NotFoundException('Planta no encontrada');
        }

        // Actualizar el estado de la planta a "muerta"
        return this.prisma.plant.update({
            where: { id: plantId },
            data: {
                status: 'dead', // Cambiar el estado a "muerta"
                plantHealth: 0, // Establecer la salud en 0
                hasFruits: false, // La planta muerta no puede tener frutos
            },
        });
    }
}