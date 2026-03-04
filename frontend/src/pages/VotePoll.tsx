import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, ChevronRight, Pencil, Trash2,
  MessageCircle, Share2, BarChart3, GitBranch, X,
  LogIn, Flag, ThumbsUp
} from "lucide-react";
import { toast } from "sonner";
import AuthModal from "../components/AuthModal";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";

interface PollOption {
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
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
}

type Panel = "results" | "comments" | "remixes" | "report" | null;

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
      // ignored
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
      // ignored
    }
  };

  useEffect(() => { fetchPoll(); }, [shareId]);
  useEffect(() => { if (panel === "comments" && poll) fetchComments(); }, [panel, poll]);

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
        toast(votedIndex !== null ? "Röst ändrad!" : "Röstat!");
      }
    } catch {
      // ignored
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Vill du ta bort denna poll?")) return;
    await pollApi.delete(poll!._id);
    toast("Poll borttagen");
    navigate("/dashboard");
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    await pollApi.addComment(poll!._id, { text: commentText });
    setCommentText("");
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
    toast("Tack! Rapporten skickad.");
  };

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : c));
  const next = () => setCurrent((c) => (poll && c < poll.results.length - 1 ? c + 1 : c));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (panel) return; // Don't swipe when panel open
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
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [poll]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Laddar...</div>;

  if (needsPassword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h2 className="text-xl font-bold">Denna poll kräver lösenord</h2>
        <div className="flex gap-2 w-full max-w-xs">
          <Input
            type="password"
            value={pollPassword}
            onChange={(e) => setPollPassword(e.target.value)}
            placeholder="Ange lösenord"
            onKeyDown={(e) => e.key === "Enter" && fetchPoll(pollPassword)}
          />
          <Button onClick={() => fetchPoll(pollPassword)}>Öppna</Button>
        </div>
      </div>
    );
  }

  if (!poll) return <div className="flex items-center justify-center min-h-screen">Poll hittades inte</div>;

  const opt = poll.results[current];
  const hasVoted = votedIndex !== null;
  const isVotedOption = votedIndex === current;
  const maxVotes = Math.max(...poll.results.map(r => r.voteCount));
  const isLeader = poll.showWinner !== false && opt.voteCount === maxVotes && maxVotes > 0;
  const isClosed = poll.status === "closed" || (poll.deadline && new Date(poll.deadline) < new Date());
  const sortedResults = [...poll.results]
    .map((r, i) => ({ ...r, originalIndex: i }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* === EMBED/IMAGE — full size, NO overlays on top === */}
      <div
        className="w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {opt.embedUrl && toEmbedUrl(opt.embedUrl) ? (
          <iframe
            src={toEmbedUrl(opt.embedUrl)!}
            title={opt.label}
            className="w-full h-full border-0"
            allowFullScreen
          />
        ) : opt.embedUrl && !toEmbedUrl(opt.embedUrl) ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4 p-8">
            <span className="text-3xl font-bold text-muted-foreground/30">{opt.label}</span>
            <a
              href={opt.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Öppna länk i ny flik
            </a>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Denna webbplats tillåter inte inbäddning. Klicka ovan för att öppna.
            </p>
          </div>
        ) : opt.videoUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video src={opt.videoUrl} controls className="max-w-full max-h-full" />
          </div>
        ) : opt.audioUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4">
            <span className="text-3xl font-bold text-muted-foreground/30">{opt.label}</span>
            <audio src={opt.audioUrl} controls className="w-80 max-w-[90%]" />
          </div>
        ) : opt.imageUrl ? (
          <img src={opt.imageUrl} alt={opt.label} className="w-full h-full object-contain bg-muted" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-5xl font-bold text-muted-foreground/30">{opt.label}</span>
          </div>
        )}
      </div>

      {/* === ACTION BAR — right edge on desktop, bottom on mobile === */}
      <div className="absolute z-10
        bottom-14 left-1/2 -translate-x-1/2 flex-row gap-1 p-1 flex
        md:bottom-auto md:left-auto md:translate-x-0 md:right-0 md:top-1/2 md:-translate-y-1/2 md:flex-col
      ">
        {/* Vote */}
        {isClosed ? (
          <button
            disabled
            className="p-3 rounded-full bg-gray-400 text-white border border-border cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Röstningen är stängd"
          >
            <ThumbsUp className="h-5 w-5" />
          </button>
        ) : user || poll.allowAnonymousVotes ? (
          <button
            onClick={() => handleVote(current)}
            disabled={voting || isVotedOption}
            className={`p-3 rounded-full border border-border transition focus-visible:ring-2 focus-visible:ring-ring ${
              isVotedOption
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-secondary text-foreground"
            }`}
            aria-label={isVotedOption ? "Din röst" : hasVoted ? "Byt röst hit" : "Rösta"}
          >
            <ThumbsUp className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={promptLogin}
            className="p-3 rounded-full bg-white hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Logga in för att rösta"
          >
            <LogIn className="h-5 w-5" />
          </button>
        )}

        {/* Results */}
        <button
          onClick={() => setPanel(panel === "results" ? null : "results")}
          className={`p-3 rounded-full border border-border transition focus-visible:ring-2 focus-visible:ring-ring ${
            panel === "results" ? "bg-primary text-white" : "bg-white hover:bg-secondary text-foreground"
          }`}
          aria-label="Visa resultat"
        >
          <BarChart3 className="h-5 w-5" />
        </button>

        {/* Comments */}
        <button
          onClick={() => setPanel(panel === "comments" ? null : "comments")}
          className={`p-3 rounded-full border border-border transition focus-visible:ring-2 focus-visible:ring-ring ${
            panel === "comments" ? "bg-primary text-white" : "bg-white hover:bg-secondary text-foreground"
          }`}
          aria-label="Kommentarer"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

        {/* Share */}
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Länk kopierad!"); }}
          className="p-3 rounded-full bg-white hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dela länk"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Remixes */}
        {poll.remixes && poll.remixes.length > 0 && (
          <button
            onClick={() => setPanel(panel === "remixes" ? null : "remixes")}
            className={`p-3 rounded-full border border-border transition focus-visible:ring-2 focus-visible:ring-ring ${
              panel === "remixes" ? "bg-primary text-white" : "bg-white hover:bg-secondary text-foreground"
            }`}
            aria-label={`${poll.remixes.length} remixes`}
          >
            <GitBranch className="h-5 w-5" />
          </button>
        )}

        {/* Report */}
        {user && !isOwner && (
          <button
            onClick={() => setPanel(panel === "report" ? null : "report")}
            className="p-3 rounded-full bg-white hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Rapportera"
          >
            <Flag className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* === TOP-LEFT — poll info (small, transparent) === */}
      <div className="absolute top-2 left-2 z-10 max-w-[60%]">
        <div className="bg-foreground/80 rounded-lg px-3 py-1.5 text-white">
          <p className="text-sm font-medium truncate">{poll.title}</p>
          <p className="text-xs opacity-70">
            {poll.creatorName} · {poll.totalVotes} röster
            {isClosed && <span className="ml-1 text-red-300">· Stängd</span>}
          </p>
        </div>
      </div>

      {/* === TOP-RIGHT — owner actions === */}
      {isOwner && (
        <div className="absolute top-2 right-12 z-10 flex gap-1">
          <Link
            to={`/poll/${poll.shareId}/edit`}
            className="p-2.5 rounded-full bg-white hover:bg-secondary border border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Redigera poll"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-full bg-red-500 hover:bg-red-600 border border-border text-white focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ta bort poll"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* === BOTTOM-LEFT — option label + percentage === */}
      <div className="absolute bottom-2 left-2 z-10">
        <div className="bg-foreground/80 rounded-lg px-3 py-1.5 text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{opt.label}</span>
            {isLeader && hasVoted && <span className="text-xs bg-yellow-500/80 px-1.5 py-0.5 rounded">Leder</span>}
            {isVotedOption && <span className="text-xs bg-green-500/80 px-1.5 py-0.5 rounded">Din röst</span>}
            {hasVoted && <span className="text-xs opacity-80">{opt.percentage}%</span>}
          </div>
          {hasVoted && (
            <div className="w-full bg-white/30 rounded-full h-1 mt-1">
              <div className="bg-white h-1 rounded-full transition-all" style={{ width: `${opt.percentage}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* === BOTTOM-CENTER — dots + nav === */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {current > 0 && (
          <button onClick={prev} className="p-2.5 rounded-full bg-foreground/70 text-white hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-white" aria-label="Föregående alternativ">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex gap-1.5 bg-foreground/70 rounded-full px-3 py-2" role="tablist" aria-label="Alternativ">
          {poll.results.map((r, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Alternativ ${i + 1}: ${r.label}`}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white ${
                i === current ? "bg-white w-5" : "bg-white/50 w-2.5"
              }`}
            />
          ))}
        </div>
        {current < poll.results.length - 1 && (
          <button onClick={next} className="p-2.5 rounded-full bg-foreground/70 text-white hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-white" aria-label="Nästa alternativ">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* === BOTTOM-RIGHT — remix button === */}
      {poll.allowRemix && user && (
        <div className="absolute bottom-2 right-12 z-10">
          <button
            onClick={() => navigate(`/create?remix=${poll.shareId}`)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-secondary border border-border text-foreground text-xs font-medium"
          >
            Remix
          </button>
        </div>
      )}

      {/* === SLIDE-UP PANEL === */}
      {panel && (
        <>
          {/* Backdrop */}
          <div className="absolute inset-0 z-20" onClick={() => setPanel(null)} />

          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-background rounded-t-lg border-t max-h-[50vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <h2 className="font-semibold text-sm">
                {panel === "results" && "Resultat"}
                {panel === "comments" && "Kommentarer"}
                {panel === "remixes" && `Remixes (${poll.remixes?.length || 0})`}
                {panel === "report" && "Rapportera"}
              </h2>
              <button onClick={() => setPanel(null)} className="p-1 rounded hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Results */}
              {panel === "results" && (
                <div className="space-y-2">
                  {sortedResults.map((r, rank) => (
                    <button
                      key={r.originalIndex}
                      onClick={() => { setCurrent(r.originalIndex); setPanel(null); }}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition"
                    >
                      <span className={`text-lg font-bold w-7 text-center ${
                        rank === 0 && r.voteCount > 0 && poll.showWinner !== false ? "text-yellow-500" : "text-muted-foreground"
                      }`}>
                        {rank === 0 && r.voteCount > 0 && poll.showWinner !== false ? "👑" : `#${rank + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm truncate ${votedIndex === r.originalIndex ? "font-semibold" : ""}`}>
                            {r.label}
                          </span>
                          {votedIndex === r.originalIndex && (
                            <span className="text-xs text-green-600 shrink-0">din röst</span>
                          )}
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              rank === 0 && r.voteCount > 0 && poll.showWinner !== false ? "bg-yellow-500" : "bg-primary"
                            }`}
                            style={{ width: `${r.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium shrink-0">{r.percentage}%</span>
                    </button>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    {poll.totalVotes} röster totalt
                  </p>
                </div>
              )}

              {/* Comments — clean, no AI look */}
              {panel === "comments" && (
                <div>
                  {user && (
                    <div className="flex gap-2 mb-4">
                      <label htmlFor="comment-input" className="sr-only">Skriv en kommentar</label>
                      <input
                        id="comment-input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Skriv en kommentar..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm bg-transparent"
                        onKeyDown={(e) => e.key === "Enter" && handleComment()}
                      />
                      <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
                        Skicka
                      </Button>
                    </div>
                  )}
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Inga kommentarer än.</p>
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
                            <p className="text-sm">{c.text}</p>
                          </div>
                          {user && c.user === user.userId && (
                            <button
                              onClick={async () => {
                                await pollApi.deleteComment(c._id);
                                fetchComments();
                              }}
                              className="text-xs text-muted-foreground hover:text-destructive shrink-0"
                            >
                              Ta bort
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Remixes */}
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

              {/* Report */}
              {panel === "report" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Varför vill du rapportera denna poll?</p>
                  {["Olämpligt innehåll", "Spam", "Upphovsrätt", "Annat"].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${
                        reportReason === reason ? "border-primary bg-primary/5" : "hover:bg-accent"
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
                    Skicka rapport
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default VotePoll;
