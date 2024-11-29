import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CardDto {
  @ApiProperty({
    description: 'Título de la tarjeta',
    example: 'Conceptos básicos',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Contenido de la tarjeta',
    example: 'Contenido detallado sobre el tema',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen asociada a la tarjeta',
    example: 'https://example.com/card-image.png',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateLeccionDto {
  @ApiProperty({
    description: 'Título de la lección',
    example: 'Lección 1',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción de la lección',
    example: 'Una lección sobre los fundamentos',
  })
  @IsString()
  desc: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen asociada a la lección',
    example: 'https://example.com/image.png',
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiProperty({
    description: 'Tipo de la lección',
    enum: ['texto', 'infografia'],
    example: 'texto',
  })
  @IsEnum(['texto', 'infografia'])
  tipo: 'texto' | 'infografia';

  @ApiProperty({
    description: 'ID del nivel al que pertenece la lección',
    example: 1,
  })
  @IsNumber()
  nivelId: number;

  @ApiPropertyOptional({
    description: 'Lista de tarjetas asociadas a la lección',
    type: [CardDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];
}
