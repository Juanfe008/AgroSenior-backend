import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class OpcionDto {
  @ApiProperty({
    description: 'Texto de la opción',
    example: 'Opción 1',
  })
  @IsString()
  texto: string;

  @ApiProperty({
    description: 'Indica si la opción es correcta',
    example: true,
  })
  esCorrecta: boolean;
}

class PreguntaDto {
  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Cuál es la respuesta correcta?',
  })
  @IsString()
  texto: string;

  @ApiProperty({
    description: 'Opciones de respuesta',
    type: [OpcionDto],
  })
  opciones: OpcionDto[];
}

export class CreateCuestionarioDto {
  @ApiProperty({
    description: 'ID de la lección asociada al cuestionario',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  leccionId: number;

  @ApiProperty({
    description: 'Lista de preguntas del cuestionario',
    type: [PreguntaDto],
    required: false,
  })
  @IsOptional()
  preguntas: PreguntaDto[];
}

export class CreateCuestionarioCompletadoDto {
  @ApiProperty({
    description: 'ID del usuario que completó el cuestionario',
    example: 123,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID del cuestionario completado',
    example: 45,
  })
  @IsInt()
  cuestionarioId: number;

  @ApiProperty({
    description: 'Cantidad de experiencia ganada al completar el cuestionario',
    example: 50,
  })
  expGanada: number;
}
