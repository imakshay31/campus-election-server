import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isCandidate: {
    type: Boolean,
    default: false,
  },
  countVotedPosition: {
    type: Number,
    default: 0,
  },
  positionVoted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "position",
    },
  ],
});

const UserModel = new mongoose.model("user", userSchema);

export default UserModel;
