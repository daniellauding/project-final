import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePollStore } from "../stores/pollStore";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Lock } from "lucide-react";

const Explore = () => {
  const { polls, loading, fetchPolls } = usePollStore();

  useEffect(() => {
    fetchPolls(1, true);
  }, [fetchPolls]);

  const getThumbnail = (poll: (typeof polls)[0]): string | null => {
    if ((poll as any).thumbnailUrl) return (poll as any).thumbnailUrl;
    for (const opt of poll.options) {
      if ((opt as any).coverUrl) return (opt as any).coverUrl;
      if (opt.imageUrl) return opt.imageUrl;
      if (opt.videoUrl && opt.videoUrl.includes("cloudinary")) {
        return opt.videoUrl.replace(/\.[^.]+$/, ".jpg");
      }
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 pt-20 pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse what people are deciding on.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => {
            const thumb = getThumbnail(poll);
            return (
              <Link
                key={poll._id}
                to={`/poll/${poll.shareId}`}
                className="group block rounded-xl border border-border/60 bg-card overflow-hidden hover:bg-accent/50 transition-colors"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : poll.options.some((o: any) => o.textContent) ? (() => {
                    const textOpt = poll.options.find((o: any) => o.textContent);
                    const ext = ((textOpt as any)?.fileName || "").split(".").pop() || "md";
                    return (
                      <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 overflow-hidden relative">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-foreground/10 text-[9px] font-mono font-bold uppercase tracking-wide">{ext}</span>
                        </div>
                        <div className="flex-1 text-[10px] leading-relaxed text-muted-foreground/60 font-mono overflow-hidden">
                          {((textOpt as any)?.textContent || "").slice(0, 200).split("\n").slice(0, 8).map((line: string, li: number) => (
                            <div key={li} className={line.startsWith("#") ? "font-semibold text-foreground/50 mt-0.5" : ""}>{line || "\u00A0"}</div>
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
                    {poll.password && (
                      <Badge variant="outline" className="text-[10px] bg-background/80 backdrop-blur-sm flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" /> protected</Badge>
                    )}
                    {(poll as any).remixedFrom && (
                      <Badge variant="secondary" className="text-[10px]">Remix</Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs">{poll.totalVotes || 0} votes</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{poll.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {poll.options.length} options · by {poll.creatorName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && polls.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nothing to explore yet.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
