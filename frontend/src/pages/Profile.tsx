import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { pollApi } from "../api/polls";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { User, LogOut, Trash2 } from "lucide-react";

interface Poll {
  _id: string;
  title: string;
  shareId: string;
  creator: string;
  options: { label: string; imageUrl?: string; votes?: string[] }[];
  totalVotes?: number;
  createdAt: string;
  remixedFrom?: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const data = await pollApi.getAll(1, true);
        if (data.results) {
          setPolls(data.results.filter((p: Poll) => p.creator === user?.userId));
        }
      } catch {
        // ignored
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyPolls();
    else setLoading(false);
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!confirm("Är du säker? Ditt konto och alla dina polls raderas permanent.")) return;
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken;
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      logout();
    } catch {
      // ignored
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-muted-foreground">Logga in för att se din profil.</p>
      </div>
    );
  }

  const originals = polls.filter((p) => !p.remixedFrom);
  const remixes = polls.filter((p) => p.remixedFrom);
  const totalVotes = polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0);

  return (
    <div className="container mx-auto p-4 py-8 max-w-2xl">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-muted-foreground">{user.email || ""}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{originals.length}</div>
          <div className="text-xs text-muted-foreground">Polls</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{remixes.length}</div>
          <div className="text-xs text-muted-foreground">Remixes</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold">{totalVotes}</div>
          <div className="text-xs text-muted-foreground">Röster</div>
        </div>
      </div>

      {/* My polls */}
      <h2 className="text-lg font-semibold mb-3">Mina bidrag</h2>
      {loading ? (
        <p className="text-muted-foreground">Laddar...</p>
      ) : polls.length === 0 ? (
        <p className="text-muted-foreground">Inga polls ännu.</p>
      ) : (
        <div className="space-y-2 mb-8">
          {polls.map((poll) => (
            <Link
              key={poll._id}
              to={`/poll/${poll.shareId}`}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                {poll.options[0]?.imageUrl ? (
                  <img src={poll.options[0].imageUrl} alt={poll.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    {poll.options.length}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{poll.title}</p>
                <p className="text-xs text-muted-foreground">
                  {poll.totalVotes || 0} röster · {poll.options.length} alternativ
                </p>
              </div>
              {poll.remixedFrom && (
                <Badge variant="secondary" className="text-xs shrink-0">Remix</Badge>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="border-t pt-6 space-y-3">
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logga ut
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
          <Trash2 className="mr-2 h-4 w-4" />
          Ta bort konto
        </Button>
      </div>
    </div>
  );
};

export default Profile;
