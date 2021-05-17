import UserModel from "../../../models/user.js";
import CandidateModel from "../../../models/candidate.js";
import PositionModel from "../../../models/position.js";
import mongoose from "mongoose";

const mutation = {
  createPosition: async (args, req) => {
    try {
      const { positionInput } = args;
      const { name, description, slotIndex } = positionInput;

      const Position = await new PositionModel({
        name: name,
        description: description,
        slotIndex: slotIndex,
      });

      const savedPosition = await Position.save();

      return {
        ...savedPosition._doc,
      };
    } catch (err) {
      console.log(err);
    }
  },

  createCandidate: async (args, req) => {
    try {
      const { candidateInput } = args;
      const { email, name, phone, description, positionApplied } =
        candidateInput;

      const Candidate = await new CandidateModel({
        email: email,
        name: name,
        phone: phone,
        description: description,
        positionApplied: positionApplied,
      });

      const registeredCandidate = await Candidate.save();

      const Position = await PositionModel.findOne({
        _id: mongoose.Types.ObjectId(positionApplied),
      });

      console.log(Position);

      await Position.candidateRegister.push(registeredCandidate);

      await Position.save();

      await Position.updateOne({
        countofCandidate: Position.countofCandidate + 1,
      });

      await Position.save();

      //const user = await UserModel.findOne({ email });
      console.log(req.userId);

      const user = await UserModel.findOne({
        _id: mongoose.Types.ObjectId(req.userId),
      });

      console.log(user);

      await user.updateOne({
        isCandidate: true,
      });

      await user.save();

      return {
        ...registeredCandidate._doc,
      };
    } catch (err) {
      console.log(err);
    }
  },

  afterVoteUpdateUser: async (args, req) => {
    try {
      const { PositionId } = args;

      const user = await UserModel.findOne({
        _id: mongoose.Types.ObjectId(req.userId),
      });

      const isAlreadyVoted = user.positionVoted.find(
        (position) => position._id === PositionId
      );

      if (isAlreadyVoted) {
        return new Error(" You have Voted For This Position Already !!");
      }

      const position = await PositionModel.findOne({
        _id: mongoose.Types.ObjectId(PositionId),
      });

      await user.positionVoted.push(position);

      await user.save();

      await user.updateOne({
        countVotedPosition: user.countVotedPosition + 1,
      });

      await user.save();

      return {
        ...user._doc,
      };
    } catch (err) {
      console.log(err);
    }
  },

  afterVoteUpdateCandidate: async (args, req) => {
    try {
      const { CandidateId } = args;
      const candidate = await CandidateModel.findOne({
        _id: mongoose.Types.ObjectId(CandidateId),
      });

      await candidate.updateOne({
        voteEarned: candidate.voteEarned + 1,
      });

      await candidate.save();

      return {
        ...candidate._doc,
      };
    } catch (err) {
      console.log(err);
    }
  },

  afterVoteUpdatePosition: async (args, req) => {
    try {
      const { afterVoteInput } = args;
      const { PositionId, CandidateId } = afterVoteInput;

      const Position = await PositionModel.findOne({
        _id: mongoose.Types.ObjectId(PositionId),
      });
      const Candidate = await CandidateModel.findOne({
        _id: mongoose.Types.ObjectId(CandidateId),
      });

      await Position.updateOne({
        totalVotes: Position.totalVotes + 1,
      });

      await Position.save();

      const maxVoteTillNow = Math.max(Position.maxVotes, Candidate.voteEarned);

      await Position.updateOne({
        maxVotes: maxVoteTillNow,
      });

      await Position.save();
    } catch (err) {
      console.log(err);
    }
  },

  generateResult: async (args, req) => {
    try {
      const { PositionId } = args;

      const Position = await PositionModel.findOne({
        _id: mongoose.Types.ObjectId(PositionId),
      });

      const maxVote = Position.maxVotes;

      const CandidatesId = Position.candidateRegister;

      const registeredCandidate = await CandidateModel.find({
        _id: { $in: CandidatesId },
      });

      const winnerCandidates = registeredCandidate.map((candidate) => {
        return candidate.voteEarned === maxVote;
      });

      const size = winnerCandidates.length;
      const randomNumber = Math.floor(Math.random() * size);

      const winnerCandidate = winnerCandidates[randomNumber];

      await Position.updateOne({
        winner: winnerCandidate._id,
      });

      await Position.save();

      return winnerCandidate;
    } catch (err) {
      console.log(err);
    }
  },
};

export default mutation;
