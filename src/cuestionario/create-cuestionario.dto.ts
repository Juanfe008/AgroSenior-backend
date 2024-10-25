import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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