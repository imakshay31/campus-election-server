import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  voteEarned: {
    type: Number,
    default: 0,
  },
  uniqueIndex: {
    type: Number,
    default: -1,
  },
  positionApplied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "position",
  },
});

const CandidateModel = new mongoose.model("candidate", candidateSchema);

export default CandidateModel;
