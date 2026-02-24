import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "./models/User.js";
import Poll from "./models/Poll.js";
import Comment from "./models/Comment.js";
import Report from "./models/Report.js";
import upload from "./middleware/upload.js";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided"
    });
  }

  try {
    const user = await User.findOne({ accessToken: token });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Authentication error"
    });
  }
};

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DesignVote API",
    endpoints: [
      { method: "POST", path: "/users", description: "Register" },
      { method: "POST", path: "/sessions", description: "Login" },
      { method: "GET", path: "/users/me", description: "Get profile (auth)" },
      { method: "GET", path: "/polls", description: "Get all polls" },
      { method: "GET", path: "/polls/:shareId", description: "Get one poll" },
      { method: "POST", path: "/polls", description: "Create poll (auth)" },
      { method: "POST", path: "/polls/:id/vote", description: "Vote (auth)" },
      { method: "PATCH", path: "/polls/:id", description: "Update poll (auth, owner)" },
      { method: "DELETE", path: "/polls/:id", description: "Delete poll (auth, owner)" },
      { method: "POST", path: "/polls/:id/remix", description: "Remix a poll (auth)" },
      { method: "POST", path: "/upload", description: "Upload image (auth)" },
      { method: "GET", path: "/polls/:id/comments", description: "Get comments" },
      { method: "POST", path: "/polls/:id/comments", description: "Add comment (auth)" },
      { method: "DELETE", path: "/comments/:id", description: "Delete comment (auth, owner)" },
      { method: "POST", path: "/reports", description: "Report poll/comment (auth)" },
      { method: "GET", path: "/admin/reports", description: "View reports (admin)" },
      { method: "PATCH", path: "/admin/reports/:id", description: "Update report (admin)" },
    ]
  });
});

// Register
app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists"
      });
    }

    const user = new User({ username, email, password });
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      userId: savedUser._id,
      username: savedUser.username,
      accessToken: savedUser.accessToken
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Could not create user",
      message: error.message
    });
  }
});

// Login
app.post("/sessions", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    user.accessToken = crypto.randomUUID();
    await user.save();

    res.json({
      success: true,
      userId: user._id,
      username: user.username,
      accessToken: user.accessToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Login failed",
      message: error.message
    });
  }
});

// Get profile
app.get("/users/me", authenticateUser, async (req, res) => {
  res.json({
    userId: req.user._id,
    username: req.user.username,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
});

// Delete own account
app.delete("/users/me", authenticateUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: "Account deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Could not delete account",
      message: error.message
    });
  }
});

// Get all polls
app.get("/polls", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    let filter = { status: "published" };

    const token = req.header("Authorization");
    if (token) {
      const user = await User.findOne({ accessToken: token });
      if (user) {
        filter = {
          $or: [
            { status: "published" },
            { creator: user._id }
          ]
        };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const polls = await Poll.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Poll.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      results: polls
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch polls", message: error.message });
  }
});

// Get specific poll
app.get("/polls/:shareId", async (req, res) => {
  try {
    const poll = await Poll.findOne({ shareId: req.params.shareId });

    if (!poll) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);

    const results = poll.options.map((opt) => ({
      label: opt.label,
      imageUrl: opt.imageUrl,
      externalUrl: opt.externalUrl,
      voteCount: opt.votes.length,
      percentage: totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0
    }));

    res.json({ ...poll.toObject(), totalVotes, results });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch poll", message: error.message });
  }
});

// Create poll
app.post("/polls", authenticateUser, async (req, res) => {
  try {
    const { title, description, options, status } = req.body;

    const poll = new Poll({
      title,
      description,
      options,
      status: status || "published",
      creator: req.user._id,
      creatorName: req.user.username
    });

    const savedPoll = await poll.save();

    res.status(201).json({
      success: true,
      poll: savedPoll,
      shareUrl: `/poll/${savedPoll.shareId}`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not create poll", message: error.message });
  }
});

// Vote poll
app.post("/polls/:id/vote", authenticateUser, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ success: false, error: "Invalid option index" });
    }

    const alreadyVoted = poll.options.some(
      opt => opt.votes.some(v => v.toString() === req.user._id.toString())
    );

    if (alreadyVoted) {
      return res.status(400).json({ success: false, error: "You have already voted on this poll" });
    }

    poll.options[optionIndex].votes.push(req.user._id);
    await poll.save();

    res.json({ success: true, message: "Vote recorded!" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not vote", message: error.message });
  }
});

// Update poll (owner of poll)
app.patch("/polls/:id", authenticateUser, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const { title, description, status } = req.body;
    if (title) poll.title = title;
    if (description !== undefined) poll.description = description;
    if (status) poll.status = status;

    const updated = await poll.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update poll", message: error.message });
  }
});

// Remove poll (owner of poll)
app.delete("/polls/:id", authenticateUser, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await Comment.deleteMany({ poll: poll._id });
    await Poll.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Poll deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not delete poll", message: error.message });
  }
});

// Remix
app.post("/polls/:id/remix", authenticateUser, async (req, res) => {
  try {
    const original = await Poll.findById(req.params.id);

    if (!original) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    if (!original.allowRemix) {
      return res.status(403).json({ success: false, error: "This poll does not allow remixes" });
    }

    const { title, description, options } = req.body;

    const remix = new Poll({
      title: title || `Remix: ${original.title}`,
      description: description || original.description,
      options: options || original.options.map(opt => ({
        label: opt.label,
        imageUrl: opt.imageUrl,
        externalUrl: opt.externalUrl,
        votes: []
      })),
      creator: req.user._id,
      creatorName: req.user.username,
      remixedFrom: original._id
    });

    const saved = await remix.save();
    res.status(201).json({ success: true, poll: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not remix poll", message: error.message });
  }
});

// Upload
app.post("/upload", authenticateUser, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image provided" });
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Upload failed", message: error.message });
  }
});

// Comments
app.get("/polls/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ poll: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch comments", message: error.message });
  }
});

app.post("/polls/:id/comments", authenticateUser, async (req, res) => {
  try {
    const { text, optionIndex, imageUrl } = req.body;

    const comment = new Comment({
      text,
      user: req.user._id,
      username: req.user.username,
      poll: req.params.id,
      optionIndex: optionIndex ?? null,
      imageUrl: imageUrl || ""
    });

    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not create comment", message: error.message });
  }
});

app.delete("/comments/:id", authenticateUser, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not delete comment", message: error.message });
  }
});

// Report a poll or comment
app.post("/reports", authenticateUser, async (req, res) => {
  try {
    const { reason, message, targetType, targetId } = req.body;

    const report = new Report({
      reason,
      message: message || "",
      targetType,
      targetId,
      reporter: req.user._id,
      reporterName: req.user.username
    });

    const saved = await report.save();
    res.status(201).json({ success: true, message: "Report submitted", report: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not submit report", message: error.message });
  }
});

// Admin: Get all pending reports
app.get("/admin/reports", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { status = "pending" } = req.query;
    const reports = await Report.find({ status }).sort({ createdAt: -1 });
    res.json({ total: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch reports", message: error.message });
  }
});

// Admin: Update report status
app.patch("/admin/reports/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    res.json({ success: true, report });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update report", message: error.message });
  }
});

// Connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
  });
