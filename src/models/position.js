import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  countofCandidate: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  maxVotes: {
    type: Number,
    default: 0,
  },
  slotIndex: {
    type: Number,
    required: true,
    unique: true,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidate",
  },
  candidateRegister: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidate",
    },
  ],
});

const PositionModel = new mongoose.model("position", positionSchema);

export default PositionModel;
