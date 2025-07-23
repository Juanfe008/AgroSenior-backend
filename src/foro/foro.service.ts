import { Injectable, Delete } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto, RemovePostLikeDto, UpdatePostDto } from './foro.dto';
import { CreatePostLikeDto } from './foro.dto';
import { ActividadesService } from '../actividades/actividades.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ForoService {

    constructor(private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async createPost(createPostDto: CreatePostDto, file?: Express.Multer.File) {
        let imageUrl = null;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            imageUrl = uploadResult.url;
        }

        const post = await this.prisma.post.create({
            data: {
                ...createPostDto,
                userId: parseInt(createPostDto.userId.toString()),
                parentPostId: createPostDto.parentPostId ? parseInt(createPostDto.parentPostId.toString()) : null,
                imageUrl,
            },
        });

        this.eventEmitter.emit('user.createdPost', { userId: parseInt(createPostDto.userId.toString()) });

        return post;
    }

        //await this.actividadesService.completeActivity(parseInt(createPostDto.userId.toString()), 1);


    async getPosts(userId: number) {
        return this.getPostsWithReplies(null, userId);
    }

    private async getPostsWithReplies(parentPostId: number | null, userId: number) {
        const posts = await this.prisma.post.findMany({
            where: { parentPostId },
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                userId: true,
                parentPostId: true,
                user: {
                    select: {
                        username: true
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        },
                        replies: true,
                        likes: { select: { userId: true } }
                    }
                },
                likes: { select: { userId: true } }
            }
        });
    
        return posts.map(post => ({
            ...post,
            username: post.user.username,
            likesCount: post.likes.length,
            userHasLiked: post.likes.some(like => like.userId === userId),
            replies: post.replies.map(reply => ({
                ...reply,
                username: reply.user.username,  
                likesCount: reply.likes.length,
                userHasLiked: reply.likes.some(like => like.userId === userId),
                user: undefined, 
                likes: undefined 
            })),
            user: undefined, 
            likes: undefined 
        }));
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
            select: { userId: true, imageUrl: true },
        });

        if (!post) {
            throw new Error('Post no encontrado');
        }

        if (post.userId !== userId) {
            throw new Error('No tienes permisos para eliminar este post');
        }

        if (post.imageUrl) {
            try {
                const publicId = post.imageUrl.split('/').pop().split('.')[0];
                await this.cloudinaryService.deleteFile(publicId);
            } catch (error) {
                console.error('Error al eliminar la imagen de Cloudinary:', error);
            }
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
