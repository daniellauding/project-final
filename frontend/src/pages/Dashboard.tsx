import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePollStore } from "../stores/pollStore";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { PlusCircle, Inbox, Share2, Trash2, Pencil, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { polls: allPolls, loading, fetchPolls, deletePoll } = usePollStore();

  const polls = allPolls.filter((p) => p.creator === user?.userId);

  useEffect(() => {
    if (user) fetchPolls(1, true);
  }, [user, fetchPolls]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this poll?")) return;
    await deletePoll(id);
    toast("Poll deleted");
  };

  const copyLink = (shareId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${shareId}`);
    toast("Link copied!");
  };

  const getThumbnail = (poll: (typeof polls)[0]): string | null => {
    for (const opt of poll.options) {
      if (opt.coverUrl) return opt.coverUrl;
      if (opt.imageUrl) return opt.imageUrl;
      if (opt.videoUrl && opt.videoUrl.includes("cloudinary")) {
        return opt.videoUrl.replace(/\.[^.]+$/, ".jpg");
      }
    }
    return null;
  };

  const visibilityIcon = (v?: string) => {
    if (v === "private") return <Lock className="h-3 w-3" />;
    if (v === "unlisted") return <EyeOff className="h-3 w-3" />;
    return <Eye className="h-3 w-3" />;
  };

  const visibilityLabel = (v?: string) => {
    if (v === "private") return "Private";
    if (v === "unlisted") return "Unlisted";
    return "Public";
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>
        <p className="text-muted-foreground">You need to log in to see your polls.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your polls</h1>
          <p className="text-sm text-muted-foreground">{polls.length} contributions</p>
        </div>
        <Button asChild>
          <Link to="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New poll
          </Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40 mb-6" />
          <h2 className="text-xl font-medium mb-2">No polls yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first poll — upload images, paste a Figma link,
            and share it with your team for feedback.
          </p>
          <Button size="lg" asChild>
            <Link to="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first poll
            </Link>
          </Button>
          <div className="grid grid-cols-3 gap-4 mt-12 text-left">
            <div>
              <p className="text-xs font-medium mb-1">Images & Figma</p>
              <p className="text-xs text-muted-foreground">Upload files or embed live designs</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">One-tap voting</p>
              <p className="text-xs text-muted-foreground">Share a link, get votes instantly</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">Clear results</p>
              <p className="text-xs text-muted-foreground">See the winner with comments</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll) => {
            const thumb = getThumbnail(poll);
            const hasEmbed = poll.options.some(o => o.embedUrl);
            return (
              <Link
                key={poll._id}
                to={`/poll/${poll.shareId}`}
                className="group block rounded-lg border bg-card overflow-hidden hover:bg-accent/50 transition-colors"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={poll.title} className="w-full h-full object-cover" />
                  ) : poll.options.some((o: any) => o.textContent) ? (() => {
                    const textOpt = poll.options.find((o: any) => o.textContent);
                    const ext = (textOpt?.fileName || "").split('.').pop() || "md";
                    return (
                      <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 overflow-hidden relative">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-foreground/10 text-[9px] font-mono font-bold uppercase tracking-wide">{ext}</span>
                        </div>
                        <div className="flex-1 text-[10px] leading-relaxed text-muted-foreground/60 font-mono overflow-hidden">
                          {(textOpt?.textContent || "").slice(0, 200).split('\n').slice(0, 8).map((line: string, li: number) => (
                            <div key={li} className={line.startsWith('#') ? "font-semibold text-foreground/50 mt-0.5" : ""}>{line || "\u00A0"}</div>
                          ))}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
                      </div>
                    );
                  })() : poll.options.some((o: any) => o.audioUrl) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
                      <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                        </svg>
                      </div>
                      <span className="text-[10px] text-muted-foreground/40">{poll.options.length} tracks</span>
                    </div>
                  ) : hasEmbed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                      </svg>
                      <span className="text-[10px] text-muted-foreground/40">Embed</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50 p-4">
                      <span className="text-sm font-medium text-muted-foreground/25">{poll.title}</span>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {poll.options.slice(0, 3).map((o: any, oi: number) => (
                          <span key={oi} className="px-2 py-0.5 rounded-full bg-foreground/5 text-[9px] text-muted-foreground/40 truncate max-w-[100px]">{o.label}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={poll.status === "published" ? "default" : "secondary"} className="text-xs">
                      {poll.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p className="text-sm text-muted-foreground truncate">{poll.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{poll.options.length} options</span>
                    <span>·</span>
                    <span>{poll.totalVotes || 0} votes</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      {visibilityIcon(poll.visibility)}
                      {visibilityLabel(poll.visibility)}
                    </span>
                  </div>
                </div>

                <div className="px-3 pb-3 flex gap-2" onClick={(e) => e.preventDefault()}>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/poll/${poll.shareId}/edit`} state={{ backgroundLocation: location }}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); copyLink(poll.shareId); }}>
                    <Share2 className="mr-1 h-3 w-3" />
                    Share
                  </Button>
                  <Button size="sm" variant="destructive" aria-label="Delete poll" onClick={(e) => { e.stopPropagation(); handleDelete(poll._id); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
