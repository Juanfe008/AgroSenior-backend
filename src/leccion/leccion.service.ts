import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Card, Leccion } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LeccionService {
    constructor(private prisma: PrismaService) { }

    async createLeccion(data: {
        title: string;
        desc: string;
        tipo: 'texto' | 'infografia';
        nivelId: number;
        cards?: { title: string; content: string; imageUrl?: string }[];
    }): Promise<Leccion> {
        return this.prisma.leccion.create({
            data: {
                title: data.title,
                desc: data.desc,
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

    async findOneLeccion(id: number): Promise<Leccion & { cards: Card[] }> {
        const leccion = await this.prisma.leccion.findUnique({
          where: { id },
          include: {
            cards: {
              orderBy: {
                orden: 'asc',
              },
            },
          },
        });
      
        if (!leccion) {
          throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
        }
      
        return leccion;
      }

    async findLeccionesByNivel(nivelId: number, userId: number) {
        const lecciones = await this.prisma.leccion.findMany({
            where: { nivelId },
            include: {
                cuestionario: {
                    include: {
                        completados: {
                            where: { userId },
                            select: { id: true },
                        },
                    },
                },
            },
            orderBy: {
                orden: 'asc', // opcional: puedes ordenar directamente desde el backend
            },
        });

        return lecciones.map(leccion => ({
            id: leccion.id,
            title: leccion.title,
            desc: leccion.desc,
            completed: leccion.cuestionario?.completados.length > 0,
        }));
    }

    async updateLeccion(id: number, data: {
        title?: string;
        desc?: string;
        tipo?: 'texto' | 'infografia';
        nivelId?: number;
        cards?: { title: string; content: string; imageUrl?: string }[];
    }): Promise<Leccion> {
        const leccion = await this.prisma.leccion.findUnique({
            where: { id },
        });

        if (!leccion) {
            throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
        }

        // Si hay cards y el tipo es texto, primero eliminamos las cards existentes
        if (data.cards && data.tipo === 'texto') {
            await this.prisma.card.deleteMany({
                where: { leccionId: id },
            });
        }

        return this.prisma.leccion.update({
            where: { id },
            data: {
                title: data.title,
                desc: data.desc,
                tipo: data.tipo,
                nivelId: data.nivelId,
                cards: data.tipo === 'texto' && data.cards ? {
                    create: data.cards.map(card => ({
                        title: card.title,
                        content: card.content,
                        imageUrl: card.imageUrl || null,
                    })),
                } : undefined,
            },
            include: { cards: true },
        });
    }

    async deleteLeccion(id: number): Promise<{ message: string }> {
        const leccion = await this.prisma.leccion.findUnique({
            where: { id },
            include: {
                cuestionario: true
            }
        });

        if (!leccion) {
            throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
        }

        // Si existe un cuestionario asociado, eliminarlo primero
        if (leccion.cuestionario) {
            await this.prisma.cuestionario.delete({
                where: { id: leccion.cuestionario.id }
            });
        }

        await this.prisma.leccion.delete({
            where: { id },
        });

        return {
            message: 'Lección y cuestionario asociado eliminados exitosamente',
        };
    }
}
