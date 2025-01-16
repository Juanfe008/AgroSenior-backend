import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCuestionarioDto, CreateCuestionarioCompletadoDto } from './cuestionario.dto';
import { ActividadesService } from 'src/actividades/actividades.service';

@Injectable()
export class CuestionarioService {
  constructor(private readonly prisma: PrismaService,
    private readonly actividadesService: ActividadesService,
  ) { }

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

  async registrarCuestionarioCompletado(data: CreateCuestionarioCompletadoDto) {
    const { userId, cuestionarioId, expGanada } = data;

    const completado = await this.prisma.cuestionarioCompletado.findUnique({
      where: {
        userId_cuestionarioId: {
          userId,
          cuestionarioId,
        },
      },
    });

    if (completado) {
      throw new BadRequestException('Este cuestionario ya ha sido completado por el usuario.');
    }

    await this.prisma.cuestionarioCompletado.create({
      data: {
        userId,
        cuestionarioId,
        completadoEn: new Date(),
      },
    });
    
    this.actividadesService.completeActivity(userId, 3)

    const usuarioActualizado = await this.prisma.user.update({
      where: { id: userId },
      data: {
        exp: {
          increment: expGanada,
        },
      },
    });

    return {
      message: `Cuestionario completado y ${expGanada} puntos de experiencia otorgados.`,
      usuario: usuarioActualizado,
    };
  }
}
