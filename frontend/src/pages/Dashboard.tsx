import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pollApi } from "../api/polls";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { PlusCircle, Inbox, Share2, Trash2, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: { label: string; votes?: string[] }[];
  status: "draft" | "published";
  shareId: string;
  creator: string;
  totalVotes?: number;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await pollApi.getAll();
        if (data.results) {
          const myPolls = data.results.filter((p: Poll) => p.creator === user?.userId);
          setPolls(myPolls);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPolls();
    else setLoading(false);
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Vill du ta bort denna poll?")) return;
    await pollApi.delete(id);
    setPolls(polls.filter((p) => p._id !== id));
  };

  const copyLink = (shareId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${shareId}`);
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
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dina polls</h1>
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
          {polls.map((poll) => (
            <Card key={poll._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <Badge variant={poll.status === "published" ? "default" : "secondary"}>
                    {poll.status}
                  </Badge>
                </div>
                {poll.description && <CardDescription>{poll.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{poll.options.length} alternativ</span>
                  <span>|</span>
                  <span>{poll.totalVotes || 0} röster</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" asChild>
                  <Link to={`/poll/${poll.shareId}`}>
                    <BarChart3 className="mr-1 h-4 w-4" />
                    Visa
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => copyLink(poll.shareId)}>
                  <Share2 className="mr-1 h-4 w-4" />
                  Dela
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(poll._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
