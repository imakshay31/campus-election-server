import { Context } from "../../../index";
import UserModel, { User } from "../../../models/user";
import CandidateModel, { Candidate } from "../../../models/candidate";
import PositionModel, { Position } from "../../../models/position";
import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation, Authorized } from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import {
  PositionInput,
  CandidateInput,
  PositionIdInput,
  SubmitVoteInput,
} from "../inputTypes/inputs";
import user from "../../../models/user";

@Resolver()
export default class MutationClass {
  @Mutation((returns) => Position)
  async createPosition(
    @Arg("positionInfo") positionInput: PositionInput,
    @Ctx() context: Context
  ) {
    try {
      const { name, description, slotIndex } = positionInput;
      const position = await new PositionModel({
        id: uuidv4(),
        name,
        description,
        slotIndex,
      });

      const savedPostion = await position.save();
      return savedPostion;
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation((returns) => Candidate)
  async createCandidate(
    @Arg("candidateInfo") candidateInput: CandidateInput,
    @Ctx() context: Context
  ) {
    try {
      const { name, phone, description, positionApplied } = candidateInput;
      const email = context.user.email;
      const candidateId = context.user._id;
      const candidate = await new CandidateModel({
        id: candidateId,
        email,
        name,
        phone,
        description,
        positionApplied,
      });

      const savedCandidate = await candidate.save();

      const position = await PositionModel.findById(positionApplied);

      await position.updateOne({
        countofCandidate: position.countofCandidate + 1,
      });

      const alreadyRegisterCandidate = position.candidateRegister;

      if (alreadyRegisterCandidate === "") {
        await position.updateOne({
          candidateRegister: candidateId,
        });
      } else {
        await position.updateOne({
          candidateRegister: alreadyRegisterCandidate + `,` + candidateId,
        });
      }

      const userId = context.user._id;

      await UserModel.findByIdAndUpdate(userId, {
        isCandidate: true,
      });

      return savedCandidate;
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation((returns) => User)
  async submitVote(
    @Arg("submitVoteInput") submitVoteInput: SubmitVoteInput,
    @Ctx() context: Context
  ) {
    submitVoteInput.responses.forEach(async (response) => {
      const { candidateId, positionId } = response;

      const candidate = await CandidateModel.findById(candidateId);
      const position = await PositionModel.findById(positionId);

      await candidate.updateOne({
        voteEarned: candidate.voteEarned + 1,
      });

      await position.updateOne({
        totalVotes: position.totalVotes + 1,
      });

      const maxVoteTillNow = Math.max(position.maxVotes, candidate.voteEarned);

      await position.updateOne({
        maxVotes: maxVoteTillNow,
      });

      await candidate.save();
      await position.save();

      return context.user;
    });
  }

  @Mutation((returns) => Candidate)
  async generateResult(
    @Arg("posittionId") positionIdInput: PositionIdInput,
    @Ctx() context: Context
  ) {
    try {
      const positionId = positionIdInput.positionId;
      const position = await PositionModel.findById(positionId);
      const maxVote = position.maxVotes;

      const CandidatesId = position.candidateRegister.trim().split(",");

      var registeredCandidate: Candidate[] = [];
      CandidatesId.forEach(async (id) => {
        const candidate = await CandidateModel.findById(id);
        registeredCandidate.push(candidate);
      });

      const winnerCandidates: Candidate[] = registeredCandidate.map(
        (candidate) => {
          if (candidate.voteEarned === maxVote) return candidate;
        }
      );

      const size = winnerCandidates.length;
      const randomNumber = Math.floor(Math.random() * size);
      // console.log(winnerCandidates);
      // console.log(size);
      // console.log(randomNumber);
      const winnerCandidate: Candidate = winnerCandidates[randomNumber];
      console.log(winnerCandidate);

      await position.updateOne({
        winner: winnerCandidate._id,
      });

      return winnerCandidate;
    } catch (error) {
      console.log(error);
    }
  }
}
