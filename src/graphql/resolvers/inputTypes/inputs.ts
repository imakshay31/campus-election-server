import { InputType, Field, ObjectType } from "type-graphql";

@InputType()
export class PositionIdInput {
  @Field()
  positionId: string;
}

@InputType()
export class PositionInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  slotIndex: number;
}

@InputType()
export class CandidateInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  positionApplied: string;
}

@InputType()
export class Candidate_Position {
  @Field()
  candidateId: string;

  @Field()
  positionId: string;
}

@InputType()
export class SubmitVoteInput {
  @Field((type) => [Candidate_Position])
  responses: [Candidate_Position];
}
