import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    LikeResolver,
    LikeService,
    PrismaService,
    JwtService,
    ConfigService,
  ],
})
export class LikeModule {}
