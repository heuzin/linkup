import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePostDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Field(() => Int)
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field({ nullable: true })
  @IsString()
  video: string;
}
