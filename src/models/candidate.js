const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  email: {
    type: String,
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

const candidateModel = new mongoose.Model("candidate", candidateSchema);

export default candidateModel;
