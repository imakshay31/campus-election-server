import UserModel from "../../../models/user.js";
import CandidateModel from "../../../models/candidate.js";
import PositionModel from "../../../models/position.js";

const query = {
  getAllPosition: async (args, req) => {
    try {
      const votingPositions = await PositionModel.find();
      return votingPositions.map((position) => {
        return {
          ...position._doc,
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  getCandidateForPosition: async (args, req) => {
    try {
      const positionId = args.PositionId;
      const votingPosition = await PositionModel.findById(positionId);
      const candidatesId = votingPosition.candidateRegister;
      const candidates = await CandidateModel.find({
        _id: { $in: candidatesId },
      });
      return candidates;
    } catch (err) {
      console.log(err);
    }
  },
  getWinner: async (args, req) => {
    try {
      const positionId = args.PositionId;
      const votingPosition = await PositionModel.findById(positionId);
      const winnerId = votingPosition.winner;
      const winnerCandidate = await CandidateModel.findById(winnerId);
      return winnerCandidate;
    } catch (err) {
      console.log(err);
    }
  },
};

export default query;
