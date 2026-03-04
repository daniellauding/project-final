import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePollStore } from "../stores/pollStore";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Vote, PlusCircle } from "lucide-react";

const Home = () => {
  const { polls, loading, fetchPolls } = usePollStore();

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const getThumbnail = (poll: (typeof polls)[0]): string | null => {
    for (const opt of poll.options) {
      if (opt.imageUrl) return opt.imageUrl;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 py-8">
      {/* Hero */}
      <div className="text-center py-12 mb-8">
        <Vote className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">DesignVote</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Samla tydlig feedback på din design. Dela, rösta, bestäm.
        </p>
        <Button asChild size="lg">
          <Link to="/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Skapa poll
          </Link>
        </Button>
      </div>

      {/* Public polls feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : polls.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Senaste polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.map((poll) => {
              const thumb = getThumbnail(poll);
              return (
                <Link
                  key={poll._id}
                  to={`/poll/${poll.shareId}`}
                  className="group block rounded-lg border bg-card overflow-hidden hover:bg-accent/50 transition-colors"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={poll.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground/30">
                          {poll.options.length} alt.
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {poll.totalVotes || 0} röster
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {poll.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Av {poll.creatorName} · {poll.options.length} alternativ
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">Inga polls ännu. Bli den första!</p>
      )}
    </div>
  );
};

export default Home;
