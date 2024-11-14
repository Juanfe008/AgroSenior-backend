import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsInt } from 'class-validator';

export class CreateCuestionarioDto {
  @IsNotEmpty()
  @IsString()
  leccionId: number;

  @IsOptional()
  preguntas: {
    texto: string;
    opciones: {
      texto: string;
      esCorrecta: boolean;
    }[];
  }[];
}

export class CreateCuestionarioCompletadoDto {
  @IsInt()
  userId: number;

  @IsInt()
  cuestionarioId: number;

  expGanada: number;
}