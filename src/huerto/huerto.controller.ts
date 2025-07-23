import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { HuertoService } from './huerto.service';

@Controller('huerto')
export class HuertoController {
    constructor(private readonly huertoService: HuertoService) { }

    // Obtener todos los tipos de plantas
    @Get('plant-types')
    async getAllPlantTypes() {
        return this.huertoService.getAllPlantTypes();
    }

    // Obtener un tipo de planta por ID
    @Get('plant-types/:id')
    async getPlantTypeById(@Param('id') id: string) {
        return this.huertoService.getPlantTypeById(Number(id));
    }

    // Crear un nuevo tipo de planta
    @Post('plant-types')
    async createPlantType(
        @Body() data: {
            name: string;
            light: number;
            water: number;
            nutrients: number;
            growthDuration: number;
            images: string[];
            precio: number;
        }
    ) {
        return this.huertoService.createPlantType(data);
    }

    // Actualizar un tipo de planta
    @Patch('plant-types/:id')
    async updatePlantType(
        @Param('id') id: string,
        @Body() data: {
            name?: string;
            light?: number;
            water?: number;
            nutrients?: number;
            growthDuration?: number;
            images?: string[];
            precio?: number;
        }
    ) {
        return this.huertoService.updatePlantType(Number(id), data);
    }

    // Eliminar un tipo de planta
    @Delete('plant-types/:id')
    async deletePlantType(@Param('id') id: string) {
        return this.huertoService.deletePlantType(Number(id));
    }

    // Obtener el catálogo de plantas disponibles
    @Get('catalog')
    async getPlantCatalog() {
        return this.huertoService.getPlantCatalog();
    }

    // Crear un huerto para un usuario
    @Post(':userId')
    async createHuerto(@Param('userId') userId: string) {
        return this.huertoService.createHuerto(Number(userId));
    }

    // Obtener el huerto de un usuario
    @Get(':userId')
    async getHuerto(@Param('userId') userId: string) {
        return this.huertoService.getHuertoByUserId(Number(userId));
    }

    // Obtener los puntos de un usuario
    @Get(':userId/points')
    async getUserPoints(@Param('userId') userId: string) {
        return this.huertoService.getUserPoints(Number(userId));
    }

    // Actualizar los controles de luz, agua y nutrientes de una fila
    @Patch(':userId/controls')
    async updateControls(
        @Param('userId') userId: string,
        @Body() body: { filaIndex: number; light: number; water: number; nutrients: number },
    ) {
        return this.huertoService.updateControls(Number(userId), body.filaIndex, {
            light: body.light,
            water: body.water,
            nutrients: body.nutrients,
        });
    }

    // Plantar una semilla en una posición específica
    @Post(':userId/plant')
    async plantSeed(
        @Param('userId') userId: string,
        @Body() body: { plantTypeId: number; positionX: number; positionY: number },
    ) {
        return this.huertoService.plantSeed(Number(userId), body.plantTypeId, body.positionX, body.positionY);
    }


    // Actualizar el crecimiento de una planta 
    @Patch('plant/:plantId')
    async updatePlantGrowth(@Param('plantId') plantId: string) {
        return this.huertoService.updatePlantGrowth(Number(plantId));
    }

    // Eliminar una planta
    @Delete('plant/:plantId')
    async removePlant(@Param('plantId') plantId: string) {
        return this.huertoService.removePlant(Number(plantId));
    }

    // Cosechar frutos de una planta
    @Post('plant/:plantId/harvest')
    async harvestFruits(@Param('plantId') plantId: string) {
        return this.huertoService.harvestFruits(Number(plantId));
    }

    // Actualizar la salud de una planta
    @Patch('plant/:plantId/health')
    async updatePlantHealth(
        @Param('plantId') plantId: string,
        @Body() body: { plantHealth: number }
    ) {
        return this.huertoService.updatePlantHealth(Number(plantId), body.plantHealth);
    }

    // Matar una planta
    @Post('plant/:plantId/kill')
    async killPlant(@Param('plantId') plantId: string) {
        return this.huertoService.killPlant(Number(plantId));
    }
}