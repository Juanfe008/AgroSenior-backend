import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCuestionarioDto } from './create-cuestionario.dto';

@Injectable()
export class CuestionarioService {
  constructor(private prisma: PrismaService) { }

  async create(createCuestionarioDto: CreateCuestionarioDto) {
    const { leccionId, preguntas } = createCuestionarioDto;

    const cuestionario = await this.prisma.cuestionario.create({
      data: {
        leccion: { connect: { id: leccionId } },
        preguntas: {
          create: preguntas.map(pregunta => ({
            texto: pregunta.texto,
            opciones: {
              create: pregunta.opciones,
            },
          })),
        },
      },
      include: {
        preguntas: {
          include: {
            opciones: true,
          },
        },
      },
    });

    return cuestionario;
  }

  async findAll() {
    const cuestionarios = await this.prisma.cuestionario.findMany({
      include: {
        preguntas: {
          include: {
            opciones: true,
          },
        },
      },
    });

    return cuestionarios.map((cuestionario) => ({
      id: cuestionario.id,
      preguntas: cuestionario.preguntas.map((pregunta) => ({
        id: pregunta.id,
        texto: pregunta.texto,
        opciones: pregunta.opciones.map((opcion) => ({
          id: opcion.id,
          texto: opcion.texto,
          esCorrecta: opcion.esCorrecta,
        })),
      })),
    }));
  }


  async findOne(id: number) {
    const cuestionario = await this.prisma.cuestionario.findUnique({
      where: { id },
      include: {
        preguntas: {
          include: {
            opciones: true,
          },
        },
      },
    });

    if (cuestionario) {
      return {
        id: cuestionario.id,
        preguntas: cuestionario.preguntas.map((pregunta) => ({
          id: pregunta.id,
          texto: pregunta.texto,
          opciones: pregunta.opciones.map((opcion) => ({
            id: opcion.id,
            texto: opcion.texto,
            esCorrecta: opcion.esCorrecta,
          })),
        })),
      };
    }
    return null;
  }
}
