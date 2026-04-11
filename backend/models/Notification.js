import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["vote", "comment", "remix", "mention", "pin", "pin_reply", "pin_mention"], required: true },
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fromUsername: { type: String, default: "" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
