import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ForoService } from './foro.service';
import { CreatePostDto } from './foro.dto';
import { CreatePostLikeDto } from './foro.dto';

@Controller('foro')
export class ForoController {

    constructor(private readonly foroService: ForoService) { }

    @Post('posts')
    async createPost(@Body() createPostDto: CreatePostDto) {
        return this.foroService.createPost(createPostDto);
    }

    @Get('posts')
    async getPosts() {
        return this.foroService.getPosts();
    }

    @Post('likes')
    async addLike(@Body() createPostLikeDto: CreatePostLikeDto) {
        return this.foroService.addLike(createPostLikeDto);
    }

    @Delete('likes/:id')
    async removeLike(@Param('id', ParseIntPipe) id: number) {
      return this.foroService.removeLike(id);
    }
}
