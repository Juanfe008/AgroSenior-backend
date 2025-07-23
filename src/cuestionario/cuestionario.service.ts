import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCuestionarioDto, CreateCuestionarioCompletadoDto } from './cuestionario.dto';
import { ActividadesService } from 'src/actividades/actividades.service';
import { UsersService} from 'src/users/users.service'
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CuestionarioService {
  constructor(private readonly prisma: PrismaService,
    private readonly usersService: UsersService, 
    private readonly eventEmitter: EventEmitter2,
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
  
    this.eventEmitter.emit('user.completedCuestionario', { userId });
  
    const usuarioActualizado = await this.usersService.addExp(userId, expGanada);
  
    return {
      message: `Cuestionario completado y ${expGanada} puntos de experiencia otorgados.`,
      user: usuarioActualizado,
    };
  }    

  async update(id: number, updateCuestionarioDto: CreateCuestionarioDto) {
    const { leccionId, preguntas } = updateCuestionarioDto;

    // Verificar si el cuestionario existe
    const cuestionarioExistente = await this.prisma.cuestionario.findUnique({
      where: { id },
    });

    if (!cuestionarioExistente) {
      throw new NotFoundException('Cuestionario no encontrado');
    }

    // Eliminar preguntas y opciones existentes
    await this.prisma.cuestionario.update({
      where: { id },
      data: {
        preguntas: {
          deleteMany: {},
        },
      },
    });

    // Actualizar el cuestionario con las nuevas preguntas y opciones
    const cuestionarioActualizado = await this.prisma.cuestionario.update({
      where: { id },
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

    return cuestionarioActualizado;
  }

  async remove(id: number) {
    // Verificar si el cuestionario existe
    const cuestionario = await this.prisma.cuestionario.findUnique({
      where: { id },
    });

    if (!cuestionario) {
      throw new NotFoundException('Cuestionario no encontrado');
    }

    // Eliminar el cuestionario y sus relaciones
    await this.prisma.cuestionario.delete({
      where: { id },
    });

    return {
      message: 'Cuestionario eliminado exitosamente',
    };
  }
}
