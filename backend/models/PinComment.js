import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 500 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  emoji: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const pinCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  // Position as percentage (0-100) relative to media container
  xPercent: { type: Number, required: true, min: 0, max: 100 },
  yPercent: { type: Number, required: true, min: 0, max: 100 },
  optionIndex: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, required: true },
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  imageUrl: { type: String, default: "" },
  emoji: { type: String, default: "" },
  resolved: { type: Boolean, default: false },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const PinComment = mongoose.model("PinComment", pinCommentSchema);
export default PinComment;
