import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
    enum: ["spam", "inappropriate", "copyright", "other"]
  },
  message: {
    type: String,
    maxlength: 500,
    default: ""
  },
  targetType: {
    type: String,
    required: true,
    enum: ["poll", "comment"]
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "dismissed"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
