import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { pollApi } from "../api/polls";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResultOption {
  label: string;
  voteCount: number;
  percentage: number;
}

interface Poll {
  title: string;
  totalVotes: number;
  results: ResultOption[];
  shareId: string;
  showWinner?: boolean;
}

const Results = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await pollApi.getByShareId(shareId!);
        setPoll(data);
      } catch {
        toast("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [shareId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">Loading...</div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto p-8 text-center">
        Poll not found
      </div>
    );
  }

  const maxVotes = Math.max(...poll.results.map((r) => r.voteCount));
  const showWinner = poll.showWinner !== false;

  return (
    <div className="container mx-auto p-4 py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/poll/${poll.shareId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to poll
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="text-muted-foreground mb-6">
        {poll.totalVotes} total votes
      </p>

      <div className="space-y-4">
        {poll.results.map((opt, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <span
                className={`font-medium ${
                  showWinner && opt.voteCount === maxVotes && poll.totalVotes > 0
                    ? "text-primary"
                    : ""
                }`}
              >
                {opt.label}
                {showWinner && opt.voteCount === maxVotes && poll.totalVotes > 0 && " — Leader!"}
              </span>
              <span className="text-sm text-muted-foreground">
                {opt.voteCount} ({opt.percentage}%)
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-700 ${
                  showWinner && opt.voteCount === maxVotes && poll.totalVotes > 0
                    ? "bg-primary"
                    : "bg-primary/60"
                }`}
                style={{ width: `${opt.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
