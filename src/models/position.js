const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
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
  },
  candidateRegister: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidate",
    },
  ],
});

const positionModel = new mongoose.Model("position", positionSchema);

export default positionModel;
