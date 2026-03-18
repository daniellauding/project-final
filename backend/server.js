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
import Notification from "./models/Notification.js";
import Team from "./models/Team.js";
import Project from "./models/Project.js";
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
    message: "Welcome to Pejla API",
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
      { method: "GET", path: "/notifications", description: "Get notifications (auth)" },
      { method: "GET", path: "/notifications/unread-count", description: "Unread count (auth)" },
      { method: "PATCH", path: "/notifications/:id/read", description: "Mark one read (auth)" },
      { method: "PATCH", path: "/notifications/read-all", description: "Mark all read (auth)" },
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
      avatarUrl: savedUser.avatarUrl,
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
      avatarUrl: user.avatarUrl,
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
    avatarUrl: req.user.avatarUrl,
    createdAt: req.user.createdAt
  });
});

// Update avatar
app.patch("/users/me", authenticateUser, async (req, res) => {
  try {
    const { avatarUrl, username } = req.body;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
    if (username) req.user.username = username;
    await req.user.save();
    res.json({
      success: true,
      userId: req.user._id,
      username: req.user.username,
      avatarUrl: req.user.avatarUrl
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update profile", message: error.message });
  }
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
    const { page = 1, limit = 20, includeRemixes } = req.query;

    const hideRemixes = !includeRemixes;

    // Public feed: only published + public polls
    const publicFilter = { status: "published", visibility: { $nin: ["private", "unlisted"] } };
    if (hideRemixes) publicFilter.remixedFrom = null;

    let filter = publicFilter;

    const token = req.header("Authorization");
    if (token) {
      const user = await User.findOne({ accessToken: token });
      if (user) {
        // Logged-in users also see their own polls (any visibility)
        const myFilter = { creator: user._id };
        if (hideRemixes) myFilter.remixedFrom = null;
        filter = {
          $or: [
            publicFilter,
            myFilter
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

    const enriched = polls.map((p) => {
      const obj = p.toObject();
      obj.totalVotes = obj.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
      return obj;
    });

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      results: enriched
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

    // Password protection check
    if (poll.password) {
      const provided = req.header("X-Poll-Password") || req.query.password;
      // Owner bypasses password
      const token = req.header("Authorization");
      let isOwner = false;
      if (token) {
        const reqUser = await User.findOne({ accessToken: token });
        if (reqUser && poll.creator.toString() === reqUser._id.toString()) isOwner = true;
      }
      if (!isOwner && provided !== poll.password) {
        return res.status(403).json({ success: false, error: "Password required", requiresPassword: true });
      }
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);

    const results = poll.options.map((opt) => ({
      label: opt.label,
      imageUrl: opt.imageUrl,
      videoUrl: opt.videoUrl,
      audioUrl: opt.audioUrl,
      fileUrl: opt.fileUrl,
      fileName: opt.fileName,
      externalUrl: opt.externalUrl,
      embedUrl: opt.embedUrl,
      embedType: opt.embedType,
      textContent: opt.textContent,
      coverUrl: opt.coverUrl,
      voteCount: opt.votes.length,
      votes: opt.votes,
      percentage: totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0
    }));

    // Find remixes of this poll
    const remixes = await Poll.find({ remixedFrom: poll._id })
      .select("title shareId creatorName createdAt options")
      .sort({ createdAt: -1 });

    const remixData = remixes.map(r => ({
      _id: r._id,
      title: r.title,
      shareId: r.shareId,
      creatorName: r.creatorName,
      createdAt: r.createdAt,
      thumbnail: r.options[0]?.imageUrl || null,
    }));

    // If this is a remix, get the original's shareId
    let remixedFromData = null;
    if (poll.remixedFrom) {
      const original = await Poll.findById(poll.remixedFrom).select("shareId title creatorName");
      if (original) remixedFromData = { shareId: original.shareId, title: original.title, creatorName: original.creatorName };
    }

    res.json({ ...poll.toObject(), totalVotes, results, remixes: remixData, remixedFromData, allowAnonymousVotes: poll.allowAnonymousVotes });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch poll", message: error.message });
  }
});

// Beta deadline — creation disabled after this date
const BETA_DEADLINE = new Date("2026-03-31T23:59:59Z");

// Beta status
app.get("/beta-status", (req, res) => {
  const now = new Date();
  res.json({
    betaOpen: now <= BETA_DEADLINE,
    deadline: BETA_DEADLINE.toISOString(),
  });
});

// Create poll
app.post("/polls", authenticateUser, async (req, res) => {
  if (new Date() > BETA_DEADLINE) {
    return res.status(403).json({
      success: false,
      error: "Beta has ended. Poll creation is closed. Stay tuned for the next version!"
    });
  }

  try {
    const { title, description, options, status, allowAnonymousVotes, visibility, password, showWinner, deadline, allowRemix, thumbnailUrl } = req.body;

    const poll = new Poll({
      title,
      description,
      options,
      status: status || "published",
      allowAnonymousVotes: allowAnonymousVotes || false,
      visibility: visibility || "public",
      password: password || "",
      showWinner: showWinner !== undefined ? showWinner : true,
      deadline: deadline || null,
      allowRemix: allowRemix !== undefined ? allowRemix : true,
      thumbnailUrl: thumbnailUrl || "",
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

    // Block votes if poll is closed or deadline passed
    if (poll.status === "closed") {
      return res.status(400).json({ success: false, error: "This poll is closed" });
    }
    if (poll.deadline && new Date() > new Date(poll.deadline)) {
      return res.status(400).json({ success: false, error: "Voting deadline has passed" });
    }

    // Remove any existing vote (allows changing vote)
    poll.options.forEach(opt => {
      const idx = opt.votes.findIndex(v => v.toString() === req.user._id.toString());
      if (idx !== -1) opt.votes.splice(idx, 1);
    });

    poll.options[optionIndex].votes.push(req.user._id);
    await poll.save();

    // Create notification for poll creator
    try {
      if (poll.creator.toString() !== req.user._id.toString()) {
        await new Notification({
          user: poll.creator,
          type: "vote",
          poll: poll._id,
          fromUser: req.user._id,
          fromUsername: req.user.username,
          message: `${req.user.username} voted on your poll`
        }).save();
      }
    } catch (notifError) {
      console.error("Notification error (vote):", notifError.message);
    }

    res.json({ success: true, message: "Vote recorded!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong — try again or reach out at hello@pejla.io" });
  }
});

// Anonymous vote (no auth required — only if poll allows it)
app.post("/polls/:id/vote-anonymous", async (req, res) => {
  try {
    const { optionIndex, fingerprint } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ success: false, error: "Poll not found" });
    if (!poll.allowAnonymousVotes) return res.status(403).json({ success: false, error: "This poll requires login to vote" });
    if (poll.status === "closed") return res.status(400).json({ success: false, error: "This poll is closed" });
    if (poll.deadline && new Date() > new Date(poll.deadline)) return res.status(400).json({ success: false, error: "Voting deadline has passed" });
    if (optionIndex < 0 || optionIndex >= poll.options.length) return res.status(400).json({ success: false, error: "Invalid option index" });

    // Use fingerprint string as a pseudo-ID to prevent repeat votes
    const anonId = `anon_${fingerprint || req.ip}`;
    const alreadyVoted = poll.options.some(opt => opt.votes.some(v => v.toString() === anonId));
    if (alreadyVoted) {
      // Remove old vote, add new (change vote)
      poll.options.forEach(opt => {
        opt.votes = opt.votes.filter(v => v.toString() !== anonId);
      });
    }

    poll.options[optionIndex].votes.push(anonId);
    await poll.save();

    // Notify poll creator
    try {
      await new Notification({
        user: poll.creator,
        type: "vote",
        poll: poll._id,
        fromUsername: "Someone",
        message: "Someone voted on your poll"
      }).save();
    } catch (notifError) {
      console.error("Notification error (anon vote):", notifError.message);
    }

    res.json({ success: true, message: "Anonymous vote recorded!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong — try again or reach out at hello@pejla.io" });
  }
});

// Unvote (remove your vote)
app.post("/polls/:id/unvote", authenticateUser, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, error: "Poll not found" });
    }

    let removed = false;
    poll.options.forEach(opt => {
      const idx = opt.votes.findIndex(v => v.toString() === req.user._id.toString());
      if (idx !== -1) {
        opt.votes.splice(idx, 1);
        removed = true;
      }
    });

    if (!removed) {
      return res.status(400).json({ success: false, error: "You haven't voted on this poll" });
    }

    await poll.save();
    res.json({ success: true, message: "Vote removed" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not unvote", message: error.message });
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

    const { title, description, status, visibility, options, allowRemix, allowAnonymousVotes, password, showWinner, deadline, thumbnailUrl } = req.body;
    if (title) poll.title = title;
    if (description !== undefined) poll.description = description;
    if (status) poll.status = status;
    if (visibility) poll.visibility = visibility;
    if (options) poll.options = options;
    if (allowRemix !== undefined) poll.allowRemix = allowRemix;
    if (allowAnonymousVotes !== undefined) poll.allowAnonymousVotes = allowAnonymousVotes;
    if (password !== undefined) poll.password = password;
    if (showWinner !== undefined) poll.showWinner = showWinner;
    if (deadline !== undefined) poll.deadline = deadline || null;
    if (thumbnailUrl !== undefined) poll.thumbnailUrl = thumbnailUrl;

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
        videoUrl: opt.videoUrl,
        audioUrl: opt.audioUrl,
        fileUrl: opt.fileUrl,
        fileName: opt.fileName,
        textContent: opt.textContent,
        coverUrl: opt.coverUrl,
        votes: []
      })),
      creator: req.user._id,
      creatorName: req.user.username,
      remixedFrom: original._id
    });

    const saved = await remix.save();

    // Create notification for original poll creator
    try {
      if (original.creator.toString() !== req.user._id.toString()) {
        await new Notification({
          user: original.creator,
          type: "remix",
          poll: original._id,
          fromUser: req.user._id,
          fromUsername: req.user.username,
          message: `${req.user.username} remixed your poll`
        }).save();
      }
    } catch (notifError) {
      console.error("Notification error (remix):", notifError.message);
    }

    res.status(201).json({ success: true, poll: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not remix poll", message: error.message });
  }
});

// Upload (image, video, audio)
app.post("/upload", authenticateUser, (req, res, next) => {
  if (new Date() > BETA_DEADLINE) {
    return res.status(403).json({
      success: false,
      error: "Beta has ended. Uploads are closed. Stay tuned for the next version!"
    });
  }
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ success: false, error: "Upload failed", message: err.message });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file provided" });
  }

  const mime = req.file.mimetype || "";
  let fileType = "image";
  if (mime.startsWith("video/")) fileType = "video";
  else if (mime.startsWith("audio/")) fileType = "audio";
  else if (!mime.startsWith("image/")) fileType = "file";

  res.json({
    success: true,
    url: req.file.path,
    imageUrl: req.file.path, // backwards compat
    fileType,
    publicId: req.file.filename
  });
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

    // Create notification for poll creator
    try {
      const poll = await Poll.findById(req.params.id);
      if (poll && poll.creator.toString() !== req.user._id.toString()) {
        await new Notification({
          user: poll.creator,
          type: "comment",
          poll: poll._id,
          fromUser: req.user._id,
          fromUsername: req.user.username,
          message: `${req.user.username} commented on your poll`
        }).save();
      }
    } catch (notifError) {
      console.error("Notification error (comment):", notifError.message);
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not create comment", message: error.message });
  }
});

app.patch("/comments/:id", authenticateUser, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    const { text, imageUrl } = req.body;
    if (text !== undefined) comment.text = text;
    if (imageUrl !== undefined) comment.imageUrl = imageUrl;
    const saved = await comment.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update comment", message: error.message });
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

// === NOTIFICATIONS ===

// Get current user's notifications
app.get("/notifications", authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("poll", "shareId title");
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch notifications", message: error.message });
  }
});

// Get unread count
app.get("/notifications/unread-count", authenticateUser, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch unread count", message: error.message });
  }
});

// Mark all as read
app.patch("/notifications/read-all", authenticateUser, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not mark notifications as read", message: error.message });
  }
});

// Mark one as read
app.patch("/notifications/:id/read", authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not mark notification as read", message: error.message });
  }
});

// === TEAMS ===

// Create team
app.post("/teams", authenticateUser, async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = new Team({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }]
    });
    const saved = await team.save();
    res.status(201).json({ success: true, team: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not create team", message: error.message });
  }
});

// Get my teams
app.get("/teams", authenticateUser, async (req, res) => {
  try {
    const teams = await Team.find({ "members.user": req.user._id })
      .populate("members.user", "username avatarUrl")
      .sort({ createdAt: -1 });
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch teams", message: error.message });
  }
});

// Get team by id
app.get("/teams/:id", authenticateUser, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members.user", "username avatarUrl email");
    if (!team) return res.status(404).json({ success: false, error: "Team not found" });

    const isMember = team.members.some(m => m.user._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, error: "Not a member" });

    const projects = await Project.find({ team: team._id }).populate("polls");
    res.json({ team, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch team", message: error.message });
  }
});

// Join team via invite code
app.post("/teams/join", authenticateUser, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const team = await Team.findOne({ inviteCode });
    if (!team) return res.status(404).json({ success: false, error: "Invalid invite code" });

    const already = team.members.some(m => m.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ success: false, error: "Already a member" });

    team.members.push({ user: req.user._id, role: "viewer" });
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not join team", message: error.message });
  }
});

// Invite user to team (by username)
app.post("/teams/:id/invite", authenticateUser, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, error: "Team not found" });

    const isAdmin = team.members.some(
      m => m.user.toString() === req.user._id.toString() && (m.role === "admin" || team.owner.toString() === req.user._id.toString())
    );
    if (!isAdmin) return res.status(403).json({ success: false, error: "Only admins can invite" });

    const { username, role } = req.body;
    const invitedUser = await User.findOne({ username });
    if (!invitedUser) return res.status(404).json({ success: false, error: "User not found" });

    const already = team.members.some(m => m.user.toString() === invitedUser._id.toString());
    if (already) return res.status(400).json({ success: false, error: "Already a member" });

    team.members.push({ user: invitedUser._id, role: role || "viewer" });
    await team.save();
    res.json({ success: true, message: `${username} added to team` });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not invite user", message: error.message });
  }
});

// Remove member from team
app.delete("/teams/:id/members/:userId", authenticateUser, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, error: "Team not found" });

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can remove members" });
    }

    team.members = team.members.filter(m => m.user.toString() !== req.params.userId);
    await team.save();
    res.json({ success: true, message: "Member removed" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not remove member", message: error.message });
  }
});

// === PROJECTS ===

// Create project in team
app.post("/teams/:teamId/projects", authenticateUser, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ success: false, error: "Team not found" });

    const member = team.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role === "viewer") {
      return res.status(403).json({ success: false, error: "Not authorized to create projects" });
    }

    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      team: team._id,
      creator: req.user._id
    });
    const saved = await project.save();
    res.status(201).json({ success: true, project: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not create project", message: error.message });
  }
});

// Add poll to project
app.post("/projects/:id/polls", authenticateUser, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: "Project not found" });

    const { pollId } = req.body;
    if (!project.polls.includes(pollId)) {
      project.polls.push(pollId);
      await project.save();
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not add poll", message: error.message });
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
