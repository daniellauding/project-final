import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, ChevronRight, Pencil, Trash2,
  MessageCircle, Share2, BarChart3, GitBranch, X,
  LogIn, Flag, ThumbsUp, Info, Image as ImageIcon,
  Eye, EyeOff, Lock, KeyRound
} from "lucide-react";
import { toast } from "sonner";
import AuthModal from "../components/AuthModal";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";
import { useOverlayVisibility } from "../hooks/useOverlayVisibility";
import TextFilePreview, { isTextFile } from "../components/TextFilePreview";

interface PollOption {
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
  fileUrl?: string;
  fileName?: string;
  voteCount: number;
  percentage: number;
  votes: string[];
}

interface RemixInfo {
  _id: string;
  title: string;
  shareId: string;
  creatorName: string;
  thumbnail: string | null;
}

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: PollOption[];
  shareId: string;
  creator: string;
  creatorName: string;
  totalVotes: number;
  results: PollOption[];
  allowRemix: boolean;
  allowAnonymousVotes: boolean;
  showWinner: boolean;
  status: string;
  deadline: string | null;
  remixes: RemixInfo[];
  remixedFrom: string | null;
  visibility?: string;
  password?: string;
}

type Panel = "results" | "comments" | "remixes" | "report" | "info" | null;

function OptionMedia({ opt }: { opt: PollOption }) {
  if (opt.embedUrl && toEmbedUrl(opt.embedUrl)) {
    return (
      <iframe
        src={toEmbedUrl(opt.embedUrl)!}
        title={opt.label}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        allowFullScreen
      />
    );
  }
  if (opt.embedUrl && !toEmbedUrl(opt.embedUrl)) {
    let domain = "";
    try { domain = new URL(opt.embedUrl).hostname.replace("www.", ""); } catch {}
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-8">
        <a
          href={opt.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-5 max-w-sm text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-background border border-border/60 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
              alt=""
              className="w-8 h-8 rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{opt.label}</p>
            <p className="text-sm text-muted-foreground mt-1">{domain}</p>
          </div>
          <span className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:opacity-90 transition">
            Open website
          </span>
        </a>
      </div>
    );
  }
  if (opt.videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video src={opt.videoUrl} controls className="max-w-full max-h-full" />
      </div>
    );
  }
  if (opt.audioUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4">
        <span className="text-3xl font-bold text-muted-foreground/30">{opt.label}</span>
        <audio src={opt.audioUrl} controls className="w-80 max-w-[90%]" />
      </div>
    );
  }
  if (opt.fileUrl) {
    if (isTextFile(opt.fileUrl, opt.fileName)) {
      return <TextFilePreview url={opt.fileUrl} fileName={opt.fileName} className="w-full h-full bg-background" />;
    }
    const isPdf = opt.fileUrl.toLowerCase().includes('.pdf');
    if (isPdf) {
      return (
        <iframe src={opt.fileUrl} title={opt.label} className="w-full h-full border-0" />
      );
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4 p-8">
        <span className="inline-block px-3 py-1.5 rounded bg-muted-foreground/10 text-sm font-mono font-bold uppercase tracking-wide">
          {(opt.fileName || opt.fileUrl).split('.').pop()?.slice(0, 6) || "file"}
        </span>
        <span className="text-lg font-medium text-muted-foreground">{opt.fileName || opt.label}</span>
        <a href={opt.fileUrl} target="_blank" rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          Open file
        </a>
      </div>
    );
  }
  if (opt.imageUrl) {
    return <img src={opt.imageUrl} alt={opt.label} className="w-full h-full object-contain bg-muted" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <span className="text-5xl font-bold text-muted-foreground/30">{opt.label}</span>
    </div>
  );
}

const URL_REGEX = /https?:\/\/[^\s<]+/g;
const IMG_EXT = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|ogg)(\?.*)?$/i;
const AUDIO_EXT = /\.(mp3|wav|flac|aac|ogg|m4a)(\?.*)?$/i;

function CommentContent({ text, imageUrl, onImageClick }: { text: string; imageUrl?: string; onImageClick?: (src: string) => void }) {
  const parts = text.split(URL_REGEX);
  const urls = text.match(URL_REGEX) || [];

  const richUrls = urls.map((u) => {
    if (IMG_EXT.test(u)) return { url: u, type: "image" as const };
    if (VIDEO_EXT.test(u)) return { url: u, type: "video" as const };
    if (AUDIO_EXT.test(u)) return { url: u, type: "audio" as const };
    const embed = toEmbedUrl(u);
    if (embed) return { url: u, type: "embed" as const, embedSrc: embed };
    return { url: u, type: "link" as const };
  });

  return (
    <div className="space-y-1.5">
      {(parts.length > 1 || urls.length > 0) ? (
        <p className="text-sm break-words">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {richUrls[i] && (
                <a
                  href={richUrls[i].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-70"
                >
                  {richUrls[i].url.length > 50 ? richUrls[i].url.slice(0, 50) + "…" : richUrls[i].url}
                </a>
              )}
            </span>
          ))}
        </p>
      ) : (
        text !== "📎" && <p className="text-sm">{text}</p>
      )}

      {richUrls.map((r, i) => {
        if (r.type === "image") return <img key={i} src={r.url} alt="" className="max-h-32 rounded border cursor-pointer hover:opacity-80" loading="lazy" onClick={() => onImageClick?.(r.url)} />;
        if (r.type === "video") return <video key={i} src={r.url} controls className="max-h-40 rounded border bg-black" />;
        if (r.type === "audio") return <audio key={i} src={r.url} controls className="w-full" />;
        if (r.type === "embed") return <iframe key={i} src={r.embedSrc} title="" className="w-full h-36 rounded border-0" allowFullScreen />;
        return null;
      })}

      {imageUrl && (
        <img src={imageUrl} alt="" className="max-h-32 rounded border cursor-pointer hover:opacity-80" loading="lazy" onClick={() => onImageClick?.(imageUrl)} />
      )}
    </div>
  );
}

const VotePoll = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setRedirectPath } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [reportReason, setReportReason] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [pollPassword, setPollPassword] = useState("");
  const [commentImageUrl, setCommentImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const overlayVisible = useOverlayVisibility(panel !== null);
  const overlayClass = `transition-opacity duration-300 ${overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`;

  const isOwner = user && poll && user.userId === poll.creator;

  const promptLogin = () => {
    setRedirectPath(location.pathname);
    setShowAuth(true);
  };

  const fetchPoll = async (pw?: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const url = pw ? `${API_URL}/polls/${shareId}?password=${encodeURIComponent(pw)}` : `${API_URL}/polls/${shareId}`;
      const res = await fetch(url, { headers: { Authorization: token } });
      const data = await res.json();

      if (data.requiresPassword) {
        setNeedsPassword(true);
        setLoading(false);
        return;
      }

      setPoll(data);
      setNeedsPassword(false);
      if (user && data.results) {
        const idx = data.results.findIndex((opt: PollOption) =>
          opt.votes?.some((v: string) => v === user.userId)
        );
        setVotedIndex(idx >= 0 ? idx : null);
      }
    } catch {
      toast("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!poll) return;
    try {
      const data = await pollApi.getComments(poll._id);
      setComments(data);
    } catch {
      toast("Failed to load comments");
    }
  };

  useEffect(() => { fetchPoll(); }, [shareId]);
  useEffect(() => { if (poll) fetchComments(); }, [poll?._id]);
  useEffect(() => { if (panel === "comments" && poll) fetchComments(); }, [panel]);

  const handleVote = async (optionIndex: number) => {
    if (voting) return;
    setVoting(true);
    try {
      let data;
      if (user) {
        data = await pollApi.vote(poll!._id, optionIndex);
      } else if (poll?.allowAnonymousVotes) {
        data = await pollApi.voteAnonymous(poll!._id, optionIndex);
      } else {
        return;
      }
      if (data.success) {
        setVotedIndex(optionIndex);
        fetchPoll();
        toast(votedIndex !== null ? "Vote changed!" : "Voted!");
      }
    } catch {
      toast("Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    await pollApi.delete(poll!._id);
    toast("Poll deleted");
    navigate("/dashboard");
  };

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const data = await pollApi.upload(file);
      return data.url || data.imageUrl || null;
    } catch {
      toast("Upload failed");
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleCommentPaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setCommentImageUrl(url);
        return;
      }
    }
  }, [uploadFile]);

  const handleComment = async () => {
    if ((!commentText.trim() && !commentImageUrl) || !user) return;
    await pollApi.addComment(poll!._id, {
      text: commentText || (commentImageUrl ? "📎" : ""),
      imageUrl: commentImageUrl || undefined,
    });
    setCommentText("");
    setCommentImageUrl("");
    fetchComments();
  };

  const handleReport = async () => {
    if (!reportReason.trim() || !user) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken;
    await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ reason: reportReason, targetType: "poll", targetId: poll!._id }),
    });
    setReportReason("");
    setPanel(null);
    toast("Thanks! Report submitted.");
  };

  const len = poll?.results.length ?? 0;
  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : len - 1));
  const next = () => setCurrent((c) => (c < len - 1 ? c + 1 : 0));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (panel) return;
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || panel) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    setTouchStart(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxImages.length > 0) {
        if (e.key === "ArrowLeft") setLightboxIndex((i) => (i > 0 ? i - 1 : lightboxImages.length - 1));
        if (e.key === "ArrowRight") setLightboxIndex((i) => (i < lightboxImages.length - 1 ? i + 1 : 0));
        if (e.key === "Escape") setLightboxImages([]);
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [poll, lightboxImages]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (needsPassword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h2 className="text-xl font-bold">This poll requires a password</h2>
        <div className="flex gap-2 w-full max-w-xs">
          <Input
            type="password"
            value={pollPassword}
            onChange={(e) => setPollPassword(e.target.value)}
            placeholder="Enter password"
            aria-label="Poll password"
            onKeyDown={(e) => e.key === "Enter" && fetchPoll(pollPassword)}
          />
          <Button onClick={() => fetchPoll(pollPassword)}>Open</Button>
        </div>
      </div>
    );
  }

  if (!poll) return <div className="flex items-center justify-center min-h-screen">Poll not found</div>;

  const opt = poll.results[current];
  const hasVoted = votedIndex !== null;
  const isVotedOption = votedIndex === current;
  const isClosed = poll.status === "closed" || (poll.deadline && new Date(poll.deadline) < new Date());
  const sortedResults = [...poll.results]
    .map((r, i) => ({ ...r, originalIndex: i }))
    .sort((a, b) => b.voteCount - a.voteCount);
  const showWinner = poll.showWinner !== false;

  const multiSlide = poll.results.length > 1;

  return (
    <div
      className="relative h-screen overflow-hidden bg-muted/30"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel */}
      <div className="h-full overflow-hidden">
        {multiSlide ? (
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              width: `${poll.results.length * 100}%`,
              transform: `translateX(-${(current / poll.results.length) * 100}%)`,
            }}
          >
            {poll.results.map((o, i) => (
              <div
                key={i}
                className="h-full shrink-0"
                style={{ width: `${100 / poll.results.length}%`, padding: "0.75rem 1vw" }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden shadow-sm bg-white dark:bg-background border border-border/10">
                  <OptionMedia opt={o} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full" style={{ padding: "0.75rem 1vw" }}>
            <div className="w-full h-full rounded-xl overflow-hidden shadow-sm bg-white dark:bg-background border border-border/10">
              <OptionMedia opt={opt} />
            </div>
          </div>
        )}
      </div>

      {/* Action bar — right on desktop, bottom on mobile */}
      <div className={`absolute z-10
        bottom-16 left-1/2 -translate-x-1/2 flex-row gap-1 p-1 flex
        md:bottom-auto md:left-auto md:translate-x-0 md:right-3 md:top-1/2 md:-translate-y-1/2 md:flex-col
        ${overlayClass}`}
      >
        {isClosed ? (
          <button
            disabled
            className="p-3 rounded-full bg-muted text-muted-foreground border border-border cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Voting is closed"
          >
            <ThumbsUp className="h-5 w-5" />
          </button>
        ) : user || poll.allowAnonymousVotes ? (
          <button
            onClick={() => handleVote(current)}
            disabled={voting || isVotedOption}
            className={`p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
              isVotedOption
                ? "bg-foreground text-background border-foreground"
                : "bg-background hover:bg-secondary text-foreground border-border"
            }`}
            aria-label={isVotedOption ? "Your vote" : hasVoted ? "Switch vote here" : "Vote"}
          >
            <ThumbsUp className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={promptLogin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 border border-border font-medium text-sm transition focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Log in to vote"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Log in to vote</span>
            <span className="md:hidden">Log in</span>
          </button>
        )}

        <button
          onClick={() => setPanel(panel === "results" ? null : "results")}
          className={`p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
            panel === "results" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary text-foreground border-border"
          }`}
          aria-label="Show results"
        >
          <BarChart3 className="h-5 w-5" />
        </button>

        <button
          onClick={() => setPanel(panel === "comments" ? null : "comments")}
          className={`relative p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
            panel === "comments" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary text-foreground border-border"
          }`}
          aria-label={`Comments${comments.length ? ` (${comments.length})` : ""}`}
        >
          <MessageCircle className="h-5 w-5" />
          {comments.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center px-1">
              {comments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setPanel(panel === "info" ? null : "info")}
          className={`p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
            panel === "info" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary text-foreground border-border"
          }`}
          aria-label="Poll info"
        >
          <Info className="h-5 w-5" />
        </button>

        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Link copied!"); }}
          className="p-3 rounded-full bg-background hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Share link"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {poll.remixes && poll.remixes.length > 0 && (
          <button
            onClick={() => setPanel(panel === "remixes" ? null : "remixes")}
            className={`p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
              panel === "remixes" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary text-foreground border-border"
            }`}
            aria-label={`${poll.remixes.length} remixes`}
          >
            <GitBranch className="h-5 w-5" />
          </button>
        )}

        {user && !isOwner && (
          <button
            onClick={() => setPanel(panel === "report" ? null : "report")}
            className="p-3 rounded-full bg-background hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Report"
          >
            <Flag className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Top-right — owner actions (below header area) */}
      {isOwner && (
        <div className={`absolute top-14 right-3 z-10 flex flex-col items-end gap-1 ${overlayClass}`}>
          <div className="flex gap-1">
            <Link
              to={`/poll/${poll.shareId}/edit`}
              state={{ backgroundLocation: location }}
              className="p-2 rounded-full bg-background/80 hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Edit poll"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-background/80 hover:bg-destructive/10 border border-border text-destructive focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Delete poll"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-1">
            {poll.visibility && poll.visibility !== "public" && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 border border-border text-[10px] text-muted-foreground">
                {poll.visibility === "private" ? <Lock className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                {poll.visibility}
              </span>
            )}
            {poll.password && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 border border-border text-[10px] text-muted-foreground">
                <KeyRound className="h-2.5 w-2.5" /> password
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom-left — option label */}
      <div className={`absolute bottom-3 left-3 z-10 ${overlayClass}`}>
        <span className="text-[11px] text-muted-foreground/50">{opt.label}</span>
      </div>

      {/* Bottom-center — dots + nav */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 ${overlayClass}`}>
        {multiSlide && (
          <button onClick={prev} className="p-2 rounded-full bg-foreground/60 backdrop-blur-sm text-background hover:bg-foreground/80 focus-visible:ring-2 focus-visible:ring-ring" aria-label="Previous option">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex gap-1.5 bg-foreground/60 backdrop-blur-sm rounded-full px-3 py-2" role="tablist" aria-label="Option">
          {poll.results.map((r, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Option ${i + 1}: ${r.label}`}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-ring ${
                i === current ? "bg-background w-5" : "bg-background/40 w-2"
              }`}
            />
          ))}
        </div>
        {multiSlide && (
          <button onClick={next} className="p-2 rounded-full bg-foreground/60 backdrop-blur-sm text-background hover:bg-foreground/80 focus-visible:ring-2 focus-visible:ring-ring" aria-label="Next option">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom-right — remix */}
      {poll.allowRemix && user && (
        <div className={`absolute bottom-3 right-3 z-10 ${overlayClass}`}>
          <button
            onClick={() => navigate(`/create?remix=${poll.shareId}`)}
            className="px-3 py-1.5 rounded-full bg-background hover:bg-secondary border border-border text-foreground text-xs font-medium"
          >
            Remix
          </button>
        </div>
      )}

      {/* Side panel */}
      {panel && (
        <>
          <div className="fixed inset-0 z-50 bg-black/10" onClick={() => setPanel(null)} />

          <div role="dialog" aria-modal="true" aria-label={`${panel === "info" ? "Poll info" : panel === "results" ? "Results" : panel === "comments" ? "Comments" : panel === "remixes" ? "Remixes" : "Report"} panel`} className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-background border-l shadow-lg flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {panel === "info" && "Info"}
                {panel === "results" && "Results"}
                {panel === "comments" && "Comments"}
                {panel === "remixes" && `Remixes (${poll.remixes?.length || 0})`}
                {panel === "report" && "Report"}
              </h2>
              <button onClick={() => setPanel(null)} aria-label="Close panel" className="p-1 rounded hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {panel === "results" && (
                <div className="space-y-0.5">
                  {sortedResults.map((r, i) => (
                    <button
                      key={r.originalIndex}
                      onClick={() => { setCurrent(r.originalIndex); setPanel(null); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-accent/40 transition group/row"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs truncate ${votedIndex === r.originalIndex ? "font-medium" : "text-muted-foreground"}`}>
                          {r.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0">{r.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1 mt-1">
                        <div
                          className="h-1 rounded-full transition-all bg-primary"
                          style={{ width: `${r.percentage}%`, opacity: showWinner ? (i === 0 ? 1 : i === 1 ? 0.6 : 0.3) : 0.6 }}
                        />
                      </div>
                    </button>
                  ))}
                  <p className="text-[10px] text-muted-foreground/50 text-center pt-3">
                    {poll.totalVotes} votes
                  </p>
                </div>
              )}

              {panel === "comments" && (
                <div>
                  {user && (
                    <div className="mb-4 space-y-2">
                      {commentImageUrl && (
                        <div className="relative inline-block">
                          <img src={commentImageUrl} alt="Attachment" className="max-h-24 rounded border" />
                          <button
                            onClick={() => setCommentImageUrl("")}
                            aria-label="Remove attachment"
                            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <label htmlFor="comment-input" className="sr-only">Write a comment</label>
                        <input
                          ref={commentInputRef}
                          id="comment-input"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onPaste={handleCommentPaste}
                          placeholder={uploadingImage ? "Uploading..." : "Comment or paste image..."}
                          className="flex-1 border rounded-lg px-3 py-2 text-sm bg-transparent"
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleComment()}
                          disabled={uploadingImage}
                        />
                        <Button size="sm" onClick={handleComment} disabled={(!commentText.trim() && !commentImageUrl) || uploadingImage}>
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((c: any) => (
                        <div key={c._id} className="flex gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-medium">
                            {c.username?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{c.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(c.createdAt).toLocaleDateString("sv")}
                              </span>
                            </div>
                            {editingComment === c._id ? (
                              <div className="mt-1 flex gap-1.5">
                                <input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="flex-1 border rounded px-2 py-1 text-sm bg-transparent"
                                  aria-label="Edit comment"
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                      await pollApi.editComment(c._id, { text: editText });
                                      setEditingComment(null);
                                      fetchComments();
                                    }
                                    if (e.key === "Escape") setEditingComment(null);
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={async () => {
                                    await pollApi.editComment(c._id, { text: editText });
                                    setEditingComment(null);
                                    fetchComments();
                                  }}
                                  className="text-xs text-primary shrink-0"
                                >
                                  Save
                                </button>
                                <button onClick={() => setEditingComment(null)} className="text-xs text-muted-foreground shrink-0">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <CommentContent text={c.text} imageUrl={c.imageUrl} onImageClick={(src) => {
                                const allImages = comments.flatMap((cm: any) => {
                                  const imgs: string[] = [];
                                  if (cm.imageUrl) imgs.push(cm.imageUrl);
                                  const matched = cm.text.match(URL_REGEX) || [];
                                  matched.filter((u: string) => IMG_EXT.test(u)).forEach((u: string) => imgs.push(u));
                                  return imgs;
                                });
                                setLightboxImages(allImages);
                                setLightboxIndex(Math.max(0, allImages.indexOf(src)));
                              }} />
                            )}
                          </div>
                          {user && c.user === user.userId && editingComment !== c._id && (
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button
                                onClick={() => { setEditingComment(c._id); setEditText(c.text); }}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  await pollApi.deleteComment(c._id);
                                  fetchComments();
                                }}
                                className="text-xs text-muted-foreground hover:text-destructive"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {panel === "remixes" && (
                <div className="grid grid-cols-2 gap-3">
                  {poll.remixes?.map((r) => (
                    <Link
                      key={r._id}
                      to={`/poll/${r.shareId}`}
                      className="rounded-lg border overflow-hidden hover:bg-accent/50 transition-colors"
                    >
                      <div className="h-20 bg-muted">
                        {r.thumbnail ? (
                          <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Remix</div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.creatorName}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {panel === "info" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{poll.title}</p>
                    {poll.description && (
                      <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>By {poll.creatorName}</p>
                    <p>{poll.totalVotes} votes · {poll.results.length} options</p>
                    {poll.deadline && (
                      <p>Deadline: {new Date(poll.deadline).toLocaleDateString("sv")}</p>
                    )}
                    {isClosed && <p>This poll is closed</p>}
                  </div>
                </div>
              )}

              {panel === "report" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Why do you want to report this poll?</p>
                  {["Inappropriate content", "Spam", "Copyright", "Other"].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${
                        reportReason === reason ? "border-foreground bg-foreground/5" : "hover:bg-accent"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={!reportReason}
                    onClick={handleReport}
                  >
                    Submit report
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {lightboxImages.length > 0 && (
        <div role="dialog" aria-modal="true" aria-label="Image lightbox" className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center" onClick={() => setLightboxImages([])}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxImages([]); }} aria-label="Close lightbox" className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
          {lightboxImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i > 0 ? i - 1 : lightboxImages.length - 1)); }} aria-label="Previous image" className="absolute left-4 p-2 text-white/70 hover:text-white">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i < lightboxImages.length - 1 ? i + 1 : 0)); }} aria-label="Next image" className="absolute right-4 p-2 text-white/70 hover:text-white">
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <img src={lightboxImages[lightboxIndex]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain rounded" onClick={(e) => e.stopPropagation()} />
          {lightboxImages.length > 1 && (
            <span className="absolute bottom-4 text-white/50 text-xs">{lightboxIndex + 1} / {lightboxImages.length}</span>
          )}
        </div>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default VotePoll;
