import { IsNotEmpty, IsOptional, IsString, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título del post',
    example: 'Mi primera publicación',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Contenido del post',
    example: 'Este es el contenido de mi primera publicación en el foro.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'URL de una imagen opcional para el post',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'ID del post padre si este post es una respuesta',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsInt()
  parentPostId: number | null;

  @ApiProperty({
    description: 'ID del usuario que crea el post',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Título del post',
    example: 'Mi nueva publicación editada',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Contenido del post',
    example: 'Este es el contenido actualizado de mi publicación en el foro.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'URL de una imagen opcional para el post',
    example: 'https://example.com/new-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'ID del post padre si este post es una respuesta',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsInt()
  parentPostId?: number | null;
}

export class CreatePostLikeDto {
  @ApiProperty({
    description: 'ID del post al que se le da like',
    example: 45,
  })
  @IsNotEmpty()
  @IsInt()
  postId: number;

  @ApiProperty({
    description: 'ID del usuario que da el like',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class RemovePostLikeDto {
  @ApiProperty({
    description: 'ID del post al que se le quita el like',
    example: 45,
  })
  postId: number;

  @ApiProperty({
    description: 'ID del usuario que quita el like',
    example: 123,
  })
  userId: number;
}
