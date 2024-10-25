import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Leccion } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LeccionService {
    constructor(private prisma: PrismaService) {}

    async createLeccion(data: {
        title: string;
        desc: string;
        imgUrl?: string;
        tipo: 'texto' | 'infografia';
        nivelId: number;
        cards?: { title: string; content: string; imageUrl?: string }[];
    }): Promise<Leccion> {
        return this.prisma.leccion.create({
            data: {
                title: data.title,
                desc: data.desc,
                imgUrl: data.imgUrl || null,
                tipo: data.tipo,
                nivelId: data.nivelId,
                cards: data.tipo === 'texto' ? {
                    create: data.cards?.map(card => ({
                        title: card.title,
                        content: card.content,
                        imageUrl: card.imageUrl || null,
                    })) || [],
                } : undefined,
            },
            include: { cards: true },
        });
    }

    async findAllLecciones(): Promise<Leccion[]> {
        return this.prisma.leccion.findMany({
            include: { cards: true },
        });
    }

    async findOneLeccion(id: number): Promise<Leccion> {
        const leccion = await this.prisma.leccion.findUnique({
            where: { id },
            include: { cards: true },
        });

        if (!leccion) {
            throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
        }

        return leccion;
    }

    async findLeccionesByNivel(nivelId: number): Promise<Pick<Leccion, 'id' | 'title' | 'desc'>[]> {
        return this.prisma.leccion.findMany({
            where: { nivelId },
            select: {
                id: true,
                title: true,
                desc: true,
            },
        });
    }
}
