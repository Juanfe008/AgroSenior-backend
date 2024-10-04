import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TextoGuia, Card } from '@prisma/client';

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
}

