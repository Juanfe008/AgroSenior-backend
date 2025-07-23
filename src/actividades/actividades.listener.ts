// src/actividades/actividad.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActividadesService } from './actividades.service';

@Injectable()
export class ActividadListener {
    constructor(private readonly actividadesService: ActividadesService) { }

    @OnEvent('user.createdPost', { async: true })
    async handleCreatedPost(payload: { userId: number }) {
        // Completa solo la actividad "Publica tu primer post" (ID 1, por ejemplo)
        await this.actividadesService.completeActivity(payload.userId, 1);
    }

    @OnEvent('user.completedCuestionario', { async: true })
    async handleCompletedCuestionario(payload: { userId: number }) {
        // Completa solo la actividad "Completa un cuestionario" (ID 2, por ejemplo)
        await this.actividadesService.completeActivity(payload.userId, 2);
    }
    @OnEvent('user.completedProfile', { async: true })
    @OnEvent('user.whateverOtherEvent', { async: true })
    async handleEvento(payload: { userId: number }, eventName: string) {
        await this.actividadesService.completarActividadesPorEvento(eventName, payload.userId);
    }
}
