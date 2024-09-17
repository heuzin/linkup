import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { createWriteStream } from 'fs';
import { extname } from 'path';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './create-post.dto';
import { PostDetails } from './post.model';

@Injectable()
export class PostService {
  constructor(private readonly prsima: PrismaService) {}

  async saveVideo(video: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }): Promise<string> {
    if (!video || !['video/mp4'].includes(video.mimetype)) {
      throw new BadRequestException(
        'Invalid video file format. Only MP4 is allowed.',
      );
    }

    const videoName = `${Date.now()}${extname(video.filename)}`;
    const videoPath = `/files/${videoName}`;
    const stream = video.createReadStream();
    const outputPath = `public${videoPath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return videoPath;
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    return await this.prsima.post.create({
      data,
    });
  }

  async getPostById(id: number): Promise<PostDetails> {
    try {
      const post = await this.prsima.post.findUnique({
        where: { id },
        include: { user: true, likes: true, comments: true },
      });
      const postIds = await this.prsima.post.findMany({
        where: { userId: post.userId },
        select: { id: true },
      });

      return { ...post, otherPostIds: postIds.map((post) => post.id) };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getPosts(skip: number, take: number): Promise<Post[]> {
    return await this.prsima.post.findMany({
      skip,
      take,
      include: { user: true, likes: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostsBydUserId(userId: number): Promise<Post[]> {
    return await this.prsima.post.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.getPostById(id);

    try {
      const fs = await import('fs');
      fs.unlinkSync(`public${post.video}`);
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    await this.prsima.post.delete({ where: { id } });
  }
}
