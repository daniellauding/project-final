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
  Eye, EyeOff, Lock, KeyRound, MapPin
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "../lib/analytics";
import AuthModal from "../components/AuthModal";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";
import { useOverlayVisibility } from "../hooks/useOverlayVisibility";
import TextFilePreview, { isTextFile } from "../components/TextFilePreview";
import ReactMarkdown from "react-markdown";
import PinDropLayer from "../components/PinDropLayer";

interface PollOption {
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
  fileUrl?: string;
  fileName?: string;
  textContent?: string;
  coverUrl?: string;
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
  remixedFromData?: { shareId: string; title: string; creatorName: string } | null;
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
      <div className="w-full h-full flex items-center justify-center bg-black relative">
        {opt.coverUrl && (
          <img src={opt.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
        )}
        <video src={opt.videoUrl} controls className="max-w-full max-h-full relative z-10" />
      </div>
    );
  }
  if (opt.audioUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
        {opt.coverUrl ? (
          <>
            <img src={opt.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <span className="text-3xl font-bold text-white/80 relative z-10 drop-shadow-lg">{opt.label}</span>
            <audio src={opt.audioUrl} controls className="w-80 max-w-[90%] relative z-10" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4">
            <span className="text-3xl font-bold text-muted-foreground/30">{opt.label}</span>
            <audio src={opt.audioUrl} controls className="w-80 max-w-[90%]" />
          </div>
        )}
      </div>
    );
  }
  if (opt.textContent) {
    const ext = (opt.fileName || "").split('.').pop()?.toLowerCase() || "md";
    if (opt.coverUrl) {
      return (
        <div className="w-full h-full relative">
          <img src={opt.coverUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white text-[11px] font-mono font-bold uppercase tracking-wide">{ext}</span>
            <p className="text-white text-lg font-semibold mt-2 drop-shadow-lg">{opt.label}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-muted/30 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center gap-2 px-6 py-2.5 bg-muted/80 backdrop-blur-sm border-b border-border/30">
          <span className="px-2 py-0.5 rounded bg-foreground/10 text-[11px] font-mono font-bold uppercase tracking-wide">{ext}</span>
          {opt.fileName && <span className="text-xs text-muted-foreground">{opt.fileName}</span>}
        </div>
        <div className="px-4 md:px-8 lg:px-16 py-8">
          <div className="max-w-3xl mx-auto bg-white dark:bg-card rounded-lg shadow-sm border border-border/30 px-8 md:px-12 py-10">
            {ext === "md" ? (
              <div className="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:mb-4 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-relaxed prose-p:text-[15px] prose-li:leading-relaxed prose-li:text-[15px] prose-ul:space-y-0.5 prose-ol:space-y-0.5 max-w-none">
                <ReactMarkdown>{opt.textContent}</ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground/80">{opt.textContent}</pre>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (opt.fileUrl) {
    const fileExt = (opt.fileName || opt.fileUrl).split('.').pop()?.toLowerCase() || "file";
    const isText = isTextFile(opt.fileUrl, opt.fileName);
    const isPdf = fileExt === "pdf";

    if (opt.coverUrl && (isText || isPdf)) {
      return (
        <div className="w-full h-full relative">
          <img src={opt.coverUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white text-[11px] font-mono font-bold uppercase tracking-wide">{fileExt}</span>
            <p className="text-white text-lg font-semibold mt-2 drop-shadow-lg">{opt.label}</p>
          </div>
        </div>
      );
    }

    if (isText) {
      return (
        <div className="w-full h-full bg-background relative">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-foreground/10 text-[11px] font-mono font-bold uppercase tracking-wide">{fileExt}</span>
            {opt.fileName && <span className="text-xs text-muted-foreground">{opt.fileName}</span>}
          </div>
          <TextFilePreview url={opt.fileUrl} fileName={opt.fileName} className="w-full h-full pt-10 bg-background" />
        </div>
      );
    }
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
  const hasCode = text.includes("```") || text.includes("`");
  const hasMarkdown = hasCode || text.includes("**") || text.includes("##") || text.includes("- ");

  return (
    <div className="space-y-1.5">
      {hasMarkdown ? (
        <div className="text-sm [&_pre]:bg-foreground/5 [&_pre]:rounded-md [&_pre]:p-2.5 [&_pre]:my-1.5 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:font-mono [&_pre]:text-foreground/80 [&_code]:bg-foreground/5 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-foreground/80 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_p]:mb-1 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_a]:text-primary [&_a]:underline">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      ) : text !== "📎" ? (
        <p className="text-sm break-words">{text}</p>
      ) : null}

      {imageUrl && (
        <img src={imageUrl} alt="" className="max-h-32 rounded border cursor-pointer hover:opacity-80" loading="lazy" onClick={() => onImageClick?.(imageUrl)} />
      )}
    </div>
  );
}

const VotePoll = () => {
  const { shareId, optionNum } = useParams<{ shareId: string; optionNum?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setRedirectPath } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [current, setCurrent] = useState(() => {
    // Support both /poll/:id/option/N and ?option=N (legacy)
    if (optionNum) return Math.max(0, parseInt(optionNum, 10) - 1);
    const params = new URLSearchParams(window.location.search);
    const opt = params.get("option");
    return opt ? Math.max(0, parseInt(opt, 10) - 1) : 0;
  });
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
  const [pinMode, setPinMode] = useState(false);
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
      // Clamp ?option= to valid range
      if (data.results) {
        setCurrent((c) => Math.min(c, data.results.length - 1));
      }
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

  // Stop all audio/video when switching slides + update URL
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.querySelectorAll("audio, video").forEach((m) => {
      const media = m as HTMLMediaElement;
      if (!media.paused) { media.pause(); }
    });
  }, [current]);

  // Keep URL in sync with current option
  useEffect(() => {
    if (!poll || poll.results.length <= 1) return;
    const path = `/poll/${shareId}/option/${current + 1}`;
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  }, [current, poll, shareId]);

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
        trackEvent("poll_voted", {
          poll_id: poll!._id,
          share_id: shareId,
          option_index: optionIndex,
          anonymous: !user,
          changed_vote: votedIndex !== null,
        });
        setVotedIndex(optionIndex);
        fetchPoll();
        toast(votedIndex !== null ? "Vote changed!" : "Voted!");
      } else {
        toast.error(data.error || "Something went wrong — try again or reach out at hello@pejla.io");
      }
    } catch {
      toast.error("Could not connect — check your internet and try again");
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
    trackEvent("comment_added", { poll_id: poll!._id, has_image: !!commentImageUrl });
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
      if (e.key === "Escape") { setPanel(null); setPinMode(false); }
      // Figma-style shortcuts: C = comment/pin mode, V = view mode
      if (e.key === "c" && !e.metaKey && !e.ctrlKey && !(e.target as HTMLElement).closest("input,textarea")) {
        setPinMode(true);
      }
      if (e.key === "v" && !e.metaKey && !e.ctrlKey && !(e.target as HTMLElement).closest("input,textarea")) {
        setPinMode(false);
      }
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
      {/* Remix banner */}
      {poll.remixedFromData && (
        <div className="absolute top-14 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <Link
            to={`/poll/${poll.remixedFromData.shareId}`}
            className="pointer-events-auto px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <span>Remix of</span>
            <span className="font-medium text-foreground">{poll.remixedFromData.title}</span>
            <span>by {poll.remixedFromData.creatorName}</span>
          </Link>
        </div>
      )}

      {/* Carousel */}
      <div ref={carouselRef} className="h-full overflow-hidden">
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
                <div className="relative w-full h-full rounded-xl shadow-sm bg-white dark:bg-background border border-border/10">
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <OptionMedia opt={o} />
                  </div>
                  <PinDropLayer
                    pollId={poll._id}
                    optionIndex={i}
                    enabled={pinMode && current === i}
                    onToggle={() => setPinMode(!pinMode)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full" style={{ padding: "0.75rem 1vw" }}>
            <div className="relative w-full h-full rounded-xl shadow-sm bg-white dark:bg-background border border-border/10">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <OptionMedia opt={opt} />
              </div>
              <PinDropLayer
                pollId={poll._id}
                optionIndex={current}
                enabled={pinMode}
                onToggle={() => setPinMode(!pinMode)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Remix indicator */}
      {poll.remixes && poll.remixes.length > 0 && !poll.remixedFromData && (
        <button
          onClick={() => setPanel(panel === "remixes" ? null : "remixes")}
          className={`absolute z-10 bottom-28 md:bottom-auto md:top-16 left-1/2 -translate-x-1/2 md:left-auto md:right-3 md:translate-x-0 px-3 py-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 ${overlayClass}`}
        >
          <GitBranch className="h-3 w-3" />
          {poll.remixes.length} remix{poll.remixes.length > 1 ? "es" : ""} of this poll
        </button>
      )}

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
          onClick={() => setPinMode(!pinMode)}
          className={`p-3 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring ${
            pinMode ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary text-foreground border-border"
          }`}
          aria-label={pinMode ? "Exit pin mode (V)" : "Drop pin feedback (C)"}
          title={pinMode ? "Exit pin mode (V)" : "Drop pin feedback (C)"}
        >
          <MapPin className="h-5 w-5" />
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
          onClick={() => {
            const base = `${window.location.origin}/poll/${poll.shareId}`;
            const url = multiSlide ? `${base}/option/${current + 1}` : base;
            navigator.clipboard.writeText(url);
            trackEvent("poll_shared", { poll_id: poll._id, share_id: poll.shareId });
            toast(multiSlide ? `Link to Option ${current + 1} copied!` : "Link copied!");
          }}
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
                      <div className="space-y-1.5">
                        <label htmlFor="comment-input" className="sr-only">Write a comment</label>
                        <textarea
                          ref={commentInputRef as any}
                          id="comment-input"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onPaste={handleCommentPaste}
                          placeholder={uploadingImage ? "Uploading..." : "Comment, paste code, or drop an image..."}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent resize-none font-mono min-h-[60px]"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleComment();
                          }}
                          disabled={uploadingImage}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Markdown + code blocks supported. Cmd+Enter to send.</span>
                          <Button size="sm" onClick={handleComment} disabled={(!commentText.trim() && !commentImageUrl) || uploadingImage}>
                            Send
                          </Button>
                        </div>
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
                          {user && (c.user === user.userId || user.role === "admin") && editingComment !== c._id && (
                            <div className="flex flex-col gap-0.5 shrink-0">
                              {c.user === user.userId && (
                                <button
                                  onClick={() => { setEditingComment(c._id); setEditText(c.text); }}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Edit
                                </button>
                              )}
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
                  {poll.remixedFromData && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground mb-1">Remixed from</p>
                      <Link to={`/poll/${poll.remixedFromData.shareId}`} className="text-sm text-primary hover:underline">
                        {poll.remixedFromData.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">by {poll.remixedFromData.creatorName}</p>
                    </div>
                  )}
                  {poll.remixes?.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground mb-1">{poll.remixes.length} remix{poll.remixes.length > 1 ? "es" : ""}</p>
                      {poll.remixes.map((r) => (
                        <Link key={r._id} to={`/poll/${r.shareId}`} className="block text-sm text-primary hover:underline">
                          {r.title} <span className="text-xs text-muted-foreground">by {r.creatorName}</span>
                        </Link>
                      ))}
                    </div>
                  )}
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
