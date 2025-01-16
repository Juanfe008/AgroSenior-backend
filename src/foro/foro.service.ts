import { Injectable, Delete } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto, RemovePostLikeDto, UpdatePostDto } from './foro.dto';
import { CreatePostLikeDto } from './foro.dto';
import { ActividadesService } from '../actividades/actividades.service';

@Injectable()
export class ForoService {

    constructor(private readonly prisma: PrismaService,
        private readonly actividadesService: ActividadesService,
    ) { }

    async createPost(createPostDto: CreatePostDto) {
        const post = await this.prisma.post.create({
            data: {
                ...createPostDto,
                userId: createPostDto.userId,
            },
        });

        await this.actividadesService.completeActivity(createPostDto.userId, 1);

        return post;
    }

    async getPosts(userId: number) {
        return this.getPostsWithReplies(null, userId);
    }

    private async getPostsWithReplies(parentPostId: number | null, userId: number) {
        const posts = await this.prisma.post.findMany({
            where: { parentPostId },
            include: {
                replies: {
                    include: {
                        replies: true,
                        likes: { select: { userId: true } }
                    }
                },
                likes: { select: { userId: true } }
            }
        });

        for (let post of posts) {
            if (post.replies.length > 0) {
                post.replies = await this.getPostsWithReplies(post.id, userId);
            }

            (post as any).likesCount = post.likes.length;
            (post as any).userHasLiked = post.likes.some(like => like.userId === userId);

            delete post.likes;
        }

        return posts;
    }

    async updatePost(postId: number, updatePostDto: UpdatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error('Post no encontrado');
        }

        const updatedPost = await this.prisma.post.update({
            where: { id: postId },
            data: updatePostDto,
        });

        return updatedPost;
    }

    async deletePost(postId: number, userId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { userId: true },
        });

        if (!post) {
            throw new Error('Post no encontrado');
        }

        if (post.userId !== userId) {
            throw new Error('No tienes permisos para eliminar este post');
        }

        await this.prisma.postLike.deleteMany({
            where: {
                post: {
                    OR: [
                        { id: postId },
                        { parentPostId: postId },
                    ],
                },
            },
        });

        await this.prisma.post.deleteMany({
            where: { parentPostId: postId },
        });

        await this.prisma.post.delete({
            where: { id: postId },
        });

        return { success: true };
    }

    async addLike(createPostLikeDto: CreatePostLikeDto) {
        const { postId, userId } = createPostLikeDto;

        const existingLike = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        if (existingLike) {
            throw new Error('User has already liked this post');
        }

        await this.prisma.postLike.create({
            data: { postId, userId },
        });

        return { success: true };
    }

    async removeLike(RemovePostLikeDto: RemovePostLikeDto) {
        await this.prisma.postLike.delete({
            where: {
                postId_userId: { postId: RemovePostLikeDto.postId, userId: RemovePostLikeDto.userId },
            },
        });

        return { success: true };
    }
}
