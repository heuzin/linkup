import { Resolver } from '@nestjs/graphql';
import { Mutation, Args, Context, Query, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post, PostDetails } from './post.model';
import { Request } from 'express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Context() context: { req: Request },
    @Args({ name: 'video', type: () => GraphQLUpload }) video: any,
    @Args('text') text: string,
  ) {
    const userId = context.req.user.sub;
    const videoPath = await this.postService.saveVideo(video);
    const postData = {
      text,
      video: videoPath,
      userId,
    };

    return await this.postService.createPost(postData);
  }

  @Query(() => PostDetails)
  async getPostById(@Args('id') id: number) {
    return await this.postService.getPostById(id);
  }

  @Query(() => [Post])
  async getPosts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 1 }) take: number,
  ) {
    return await this.postService.getPosts(skip, take);
  }

  @Query(() => [Post])
  async getPostsByUserId(@Args('userId') userId: number) {
    return await this.postService.getPostsBydUserId(userId);
  }

  @Mutation(() => Post)
  async deletePost(@Args('id') id: number) {
    return await this.postService.deletePost(id);
  }
}
