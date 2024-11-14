import { IsNotEmpty, IsOptional, IsString, IsInt, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  parentPostId: number | null;

  @IsNotEmpty()
  @IsInt()
  userId: number;  
}

export class CreatePostLikeDto {
  @IsNotEmpty()
  @IsInt()
  postId: number;

  @IsNotEmpty() 
  @IsInt()
  userId: number;
}

