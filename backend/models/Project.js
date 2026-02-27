import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  description: {
    type: String,
    default: "",
    maxlength: 500
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  polls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
