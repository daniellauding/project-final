import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePollStore } from "../stores/pollStore";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { PlusCircle, Inbox, Share2, Trash2, Pencil, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { polls: allPolls, loading, fetchPolls, deletePoll } = usePollStore();

  const polls = allPolls.filter((p) => p.creator === user?.userId);

  useEffect(() => {
    if (user) fetchPolls(1, true);
  }, [user, fetchPolls]);

  const handleDelete = async (id: string) => {
    if (!confirm("Vill du ta bort denna poll?")) return;
    await deletePoll(id);
    toast("Poll borttagen");
  };

  const copyLink = (shareId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${shareId}`);
    toast("Länk kopierad!");
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
    if (v === "private") return "Privat";
    if (v === "unlisted") return "Olistad";
    return "Publik";
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Logga in</h1>
        <p className="text-muted-foreground">Du behöver logga in för att se dina polls.</p>
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
          <h1 className="text-2xl font-bold">Dina polls</h1>
          <p className="text-sm text-muted-foreground">{polls.length} bidrag</p>
        </div>
        <Button asChild>
          <Link to="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ny poll
          </Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Inga polls ännu</h2>
          <p className="text-muted-foreground mb-4">Skapa din första poll!</p>
          <Button asChild>
            <Link to="/create">Skapa poll</Link>
          </Button>
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
                className="group block rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={poll.title} className="w-full h-full object-cover" />
                  ) : hasEmbed ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                      <span className="text-2xl font-bold text-muted-foreground/50">Embed</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground/30">
                        {poll.options.length} alt.
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={poll.status === "published" ? "default" : "secondary"} className="text-xs">
                      {poll.status === "published" ? "Publicerad" : "Utkast"}
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
                    <span>{poll.options.length} alternativ</span>
                    <span>·</span>
                    <span>{poll.totalVotes || 0} röster</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      {visibilityIcon(poll.visibility)}
                      {visibilityLabel(poll.visibility)}
                    </span>
                  </div>
                </div>

                <div className="px-3 pb-3 flex gap-2" onClick={(e) => e.preventDefault()}>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/poll/${poll.shareId}/edit`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Redigera
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); copyLink(poll.shareId); }}>
                    <Share2 className="mr-1 h-3 w-3" />
                    Dela
                  </Button>
                  <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(poll._id); }}>
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
