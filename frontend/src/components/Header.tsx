import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Vote, LayoutDashboard, PlusCircle, LogIn, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Header = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Vote className="h-6 w-6" />
          DesignVote
        </Link>

        <nav className="flex items-center gap-2">
          {user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/create">
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Ny poll
                </Link>
              </Button>
            </>
          )}

          {user ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">
                <User className="mr-1 h-4 w-4" />
                {user.username}
              </Link>
            </Button>
          ) : (
            <Button size="sm" onClick={() => setShowAuth(true)}>
              <LogIn className="mr-1 h-4 w-4" />
              Logga in
            </Button>
          )}
        </nav>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </header>
  );
};

export default Header;
