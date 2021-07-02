import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class Position {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  id?: string;

  @Field()
  @prop({ required: true, unique: true })
  name: string;

  @Field()
  @prop({ required: true })
  description: string;

  @Field((type) => Int)
  @prop({ default: 0 })
  countofCandidate: number;

  @Field((type) => Int)
  @prop({ default: 0 })
  totalVotes: number;

  @Field((type) => Int)
  @prop({ default: 0 })
  maxVotes: number;

  @Field((type) => Int)
  @prop({ required: true, unique: true })
  slotIndex: number;

  @Field()
  @prop({ default: "" })
  winner: string;

  @Field()
  @prop({ default: "" })
  candidateRegister: string;
}

export default getModelForClass(Position);
