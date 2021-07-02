import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class Candidate {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  id?: string;

  @Field()
  @prop({ required: true, unique: true })
  email: string;

  @Field()
  @prop({ required: true })
  name: string;

  @Field()
  @prop({ required: true })
  phone: string;

  @Field({ nullable: true })
  @prop({ default: "" })
  description: string;

  @Field((type) => Int)
  @prop({ default: 0 })
  voteEarned: number;

  @Field((type) => Int)
  @prop({ default: -1 })
  uniqueIndex: number;

  @Field()
  @prop({ required: true })
  positionApplied: string;
}

export default getModelForClass(Candidate);
