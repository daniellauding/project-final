import mongoose from "mongoose";
import crypto from "crypto";

const optionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    maxlength: 100
  },
  imageUrl: {
    type: String,
    default: ""
  },
  externalUrl: {
    type: String,
    default: ""
  },
  embedUrl: {
    type: String,
    default: ""
  },
  embedType: {
    type: String,
    enum: ["none", "figma", "lovable", "codepen", "generic"],
    default: "none"
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ""
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  creatorName: {
    type: String,
    default: "Anonymous"
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function(arr) {
        return arr.length >= 2;
      },
      message: "A poll must have at least 2 options"
    }
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "published"
  },
  showWinner: {
    type: Boolean,
    default: true
  },
  visibility: {
    type: String,
    enum: ["public", "unlisted", "private"],
    default: "public"
  },
  shareId: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID().slice(0, 8)
  },
  allowRemix: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    default: ""
  },
  remixedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    default: null
  },
  deadline: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
