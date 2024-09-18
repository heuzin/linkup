import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    CommentResolver,
    CommentService,
    PrismaService,
    ConfigService,
    JwtService,
  ],
})
export class CommentModule {}
