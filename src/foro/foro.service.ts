import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto } from './foro.dto';
import { CreatePostLikeDto } from './foro.dto';

@Injectable()
export class ForoService {

    constructor(private readonly prisma: PrismaService) { }

    async createPost(createPostDto: CreatePostDto) {
        return this.prisma.post.create({
            data: {
                ...createPostDto
            },
        });
    }

    async getPosts() {
        return this.getPostsWithReplies(null);
    }
    
    private async getPostsWithReplies(parentPostId: number | null) {
        const posts = await this.prisma.post.findMany({
            where: {
                parentPostId: parentPostId
            },
            include: {
                replies: {
                    include: {
                        replies: true, 
                        likes: true
                    }
                },
                likes: true
            }
        });
    
        for (let post of posts) {
            if (post.replies.length > 0) {
                post.replies = await this.getPostsWithReplies(post.id); 
            }
        }
    
        return posts;
    }    

    async addLike(createPostLikeDto: CreatePostLikeDto) {
        const { postId, userId } = createPostLikeDto;

        const existingLike = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        if (existingLike) {
            throw new Error('User has already liked this post');
        }

        return this.prisma.postLike.create({
            data: { postId, userId },
        });
    }

    async removeLike(id: number) {
        return this.prisma.postLike.delete({
          where: { id },
        });
      }
}
