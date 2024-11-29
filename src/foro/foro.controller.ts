import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ForoService } from './foro.service';
import { CreatePostDto, CreatePostLikeDto, RemovePostLikeDto, UpdatePostDto } from './foro.dto';

@ApiTags('Foro') 
@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Post('posts')
  @ApiOperation({ summary: 'Crear un nuevo post en el foro' })
  @ApiBody({
    description: 'Datos necesarios para crear un post',
    type: CreatePostDto,
  })
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.foroService.createPost(createPostDto);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Obtener todos los posts' })
  @ApiQuery({
    name: 'userId',
    description: 'ID del usuario para manejar los likes',
    required: true,
    type: Number,
  })
  async getPosts(@Query('userId', ParseIntPipe) userId: number) {
    return this.foroService.getPosts(userId);
  }

  @Put('posts/:id')
  @ApiOperation({ summary: 'Editar un post existente' })
  @ApiParam({
    name: 'id',
    description: 'ID del post a editar',
    example: 1,
  })
  @ApiBody({
    description: 'Datos necesarios para actualizar un post',
    type: UpdatePostDto,
  })
  async updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.foroService.updatePost(postId, updatePostDto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Eliminar un post por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del post a eliminar',
    example: 1,
  })
  @ApiBody({
    description: 'ID del usuario que solicita la eliminación',
    type: Number,
  })
  async deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.foroService.deletePost(postId, userId);
  }

  @Post('likes')
  @ApiOperation({ summary: 'Añadir un like a un post' })
  @ApiBody({
    description: 'Datos necesarios para añadir un like a un post',
    type: CreatePostLikeDto,
  })
  async addLike(@Body() createPostLikeDto: CreatePostLikeDto) {
    return this.foroService.addLike(createPostLikeDto);
  }

  @Delete('likes')
  @ApiOperation({ summary: 'Quitar un like de un post' })
  @ApiBody({
    description: 'Datos necesarios para quitar un like de un post',
    type: RemovePostLikeDto,
  })
  async removeLike(@Body() removePostLikeDto: RemovePostLikeDto) {
    return this.foroService.removeLike(removePostLikeDto);
  }
}
