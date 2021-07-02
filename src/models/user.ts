import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class UserResponseItem {
  @Field()
  candidateId: string;

  @Field()
  positionId: string;
}

@ObjectType()
export class UserResponse {
  @Field((type) => [UserResponseItem])
  responses: [UserResponseItem];
}

@ObjectType()
export class User {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  id?: string;

  @Field()
  @prop({ required: true, unique: true })
  email: string;

  @Field()
  @prop({ required: true })
  password: string;

  @Field()
  @prop({ default: false })
  isCandidate: boolean;

  @Field((type) => Int)
  @prop({ default: 0 })
  countVotedPosition: Number;

  @Field({ nullable: true })
  @prop({ default: "" })
  positionVoted: string;

  @Field((type) => UserResponse, { nullable: true })
  @prop({ ref: UserResponse })
  response: Ref<UserResponse>;
}

export default getModelForClass(User);
