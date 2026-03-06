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
      if (opt.imageUrl) return opt.imageUrl;
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
                  ) : hasEmbed ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-2xl font-bold text-muted-foreground/50">Embed</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground/30">
                        {poll.options.length} opt.
                      </span>
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
