import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Like } from 'src/like/like.model';
import { User } from 'src/user/user.model';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  video: string;

  @Field(() => User)
  user: User;

  @Field(() => [Like], { nullable: true })
  likes?: Like[];
}

@ObjectType()
export class PostDetails extends Post {
  @Field(() => [Number], { nullable: true })
  otherPostIds?: number[];
}
