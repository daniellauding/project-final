import { Button } from "../components/ui/button";
import { Vote } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <Vote className="h-16 w-16 text-primary" />
      <h1 className="text-4xl font-bold">DesignVote</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Samla tydlig feedback på din design. Dela, rösta, bestäm.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/create">Skapa poll</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
