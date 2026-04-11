import mongoose from "mongoose";

const pinCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  // Position as percentage (0-100) relative to media container
  xPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  yPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  // Which option in the poll
  optionIndex: {
    type: Number,
    required: true
  },
  // Auth user (nullable for anonymous)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
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
  resolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PinComment = mongoose.model("PinComment", pinCommentSchema);
export default PinComment;
