import { UseGuards } from '@nestjs/common';
import { Args, Context, Resolver, Query } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Mutation } from '@nestjs/graphql';

import { Request } from 'express';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Comment } from './comment.model';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  async getCommentsByPostId(@Args('postId') postId: number) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('postId') postId: number,
    @Args('text') text: string,
    @Context() ctx: { req: Request },
  ) {
    return this.commentService.createComment({
      text,
      postId,
      userId: ctx.req.user.sub,
    });
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  deleteComment(@Args('id') id: number, @Context() ctx: { req: Request }) {
    return this.commentService.deleteComment(id, ctx.req.user.sub);
  }
}
