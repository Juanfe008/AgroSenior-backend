import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TextoGuia, Card } from '@prisma/client';
import { NotFoundException } from '@nestjs/common'; 

@Injectable()
export class TextoGuiaService {
    constructor(private prisma: PrismaService) { }

    async createGuideWithCards(title: string, cards: { title: string, content: string, imageUrl?: string }[]): Promise<TextoGuia> {
        return this.prisma.textoGuia.create({
            data: {
                title,
                cards: {
                    create: cards.map(card => ({
                        title: card.title,
                        content: card.content,
                        imageUrl: card.imageUrl || null,
                    })),
                },
            },
            include: { cards: true },
        });
    }

    // Obtener todas las guías con sus cards
    async findAllGuides(): Promise<TextoGuia[]> {
        return this.prisma.textoGuia.findMany({
            include: { cards: true },
        });
    }

    // Obtener una guía específica por su ID
    async findOneGuide(id: number): Promise<TextoGuia> {
        const guide = await this.prisma.textoGuia.findUnique({
            where: { id },
            include: { cards: true }, // Incluir las tarjetas asociadas
        });

        if (!guide) {
            throw new NotFoundException(`Guía con ID ${id} no encontrada.`);
        }

        return guide;
    }


}

