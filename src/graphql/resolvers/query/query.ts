import { Context } from "../../../index";
import UserModel, { User } from "../../../models/user";
import "reflect-metadata";
import { Resolver, Query, Arg, Ctx, Authorized } from "type-graphql";
import { PositionIdInput } from "../inputTypes/inputs";
import CandidateModel, { Candidate } from "../../../models/candidate";
import PositionModel, { Position } from "../../../models/position";

@Resolver()
export default class QueryClass {
  @Query((returns) => User)
  async getViewer(@Ctx() context: Context) {
    const user = await UserModel.findOne({ email: context.user.email });
    user.id = user._id;
    user.password = "";
    return user;
  }

  @Query((returns) => [Position])
  async getAllPosition() {
    const votingPositions = await PositionModel.find();
    // const allPosition = votingPositions.map((position) => {
    //   return {
    //     ...position,
    //   };
    // });
    return votingPositions;
  }

  @Query((returns) => [Candidate])
  async getCandidateForPosition(
    @Arg("positionid") positionIdInput: PositionIdInput
  ) {
    const positionId = positionIdInput.positionId;
    const votingPosition = await PositionModel.findById(positionId);
    const candidatesId = votingPosition.candidateRegister.trim().split(",");
    var candidates: Candidate[] = [];
    candidatesId.forEach(async (id) => {
      const candidate = await CandidateModel.findById(id);
      candidates.push(candidate);
    });
    return candidates;
  }

  @Query((returns) => Candidate)
  async getWinner(@Arg("positionid") positionIdInput: PositionIdInput) {
    const positionId = positionIdInput.positionId;
    const votingPosition = await PositionModel.findById(positionId);
    const winnerCandidateId = votingPosition.winner;
    const winnerCandidate = await CandidateModel.findById(winnerCandidateId);
    return winnerCandidate;
  }
}
