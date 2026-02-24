import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String,
    required: true
  },
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true
  },
  optionIndex: {
    type: Number,
    default: null
  },
  imageUrl: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
