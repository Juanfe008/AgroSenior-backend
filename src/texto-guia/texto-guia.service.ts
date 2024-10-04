import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TextoGuia } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TextoGuiaService {
    constructor(private prisma: PrismaService) { }

    async createGuideWithCards(title: string, desc: string, cards: { title: string, content: string, imageUrl?: string }[], nivelId: number): Promise<TextoGuia> {
        return this.prisma.textoGuia.create({
            data: {
                title,
                desc,
                cards: {
                    create: cards.map(card => ({
                        title: card.title,
                        content: card.content,
                        imageUrl: card.imageUrl || null,
                    })),
                },
                nivelId
            },
            include: { cards: true },
        });
    }

    async findAllGuides(): Promise<TextoGuia[]> {
        return this.prisma.textoGuia.findMany({});
    }

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

    async findGuidesByNivel(nivelId: number): Promise<TextoGuia[]> {
        return this.prisma.textoGuia.findMany({
            where: {
                nivelId: nivelId,
            },
        });
    }


}

