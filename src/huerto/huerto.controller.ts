import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { HuertoService } from './huerto.service';

@Controller('huerto')
export class HuertoController {
    constructor(private readonly huertoService: HuertoService) { }

    @Post(':userId')
    async createHuerto(@Param('userId') userId: string) {
        return this.huertoService.createHuerto(Number(userId));
    }

    @Get(':userId')
    async getHuerto(@Param('userId') userId: string) {
        return this.huertoService.getHuertoByUserId(Number(userId));
    }

    @Patch(':userId/controls')
    async updateControls(
        @Param('userId') userId: string,
        @Body() controls: { light: number; water: number; nutrients: number },
    ) {
        return this.huertoService.updateControls(Number(userId), controls);
    }

    @Post(':userId/plant')
    async plantSeed(
        @Param('userId') userId: string,
        @Body() body: { type: string; positionX: number; positionY: number },
    ) {
        return this.huertoService.plantSeed(Number(userId), body.type, body.positionX, body.positionY);
    }

    @Patch('plant/:plantId')
    async updatePlantGrowth(
        @Param('plantId') plantId: string,
        @Body() body: { growthStage: number; plantHealth: number },
    ) {
        return this.huertoService.updatePlantGrowth(Number(plantId), body.growthStage, body.plantHealth);
    }

    @Delete('plant/:plantId')
    async removePlant(@Param('plantId') plantId: string) {
        return this.huertoService.removePlant(Number(plantId));
    }
}
