import mongoose from "mongoose";
import crypto from "crypto";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  description: {
    type: String,
    default: "",
    maxlength: 200
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
    joinedAt: { type: Date, default: Date.now }
  }],
  inviteCode: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID().slice(0, 8)
  },
  avatarUrl: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
