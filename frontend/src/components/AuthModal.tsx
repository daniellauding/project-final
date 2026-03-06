import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, register, redirectPath, setRedirectPath } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = isLogin
      ? await login(email, password)
      : await register(username, email, password);

    setLoading(false);

    if (result.success) {
      onClose();
      setUsername("");
      setEmail("");
      setPassword("");
      // Deep link redirect
      if (redirectPath) {
        navigate(redirectPath);
        setRedirectPath(null);
      }
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Log in" : "Create account"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Wait..." : isLogin ? "Log in" : "Create account"}
          </Button>
          <button
            type="button"
            className="text-sm text-muted-foreground underline w-full text-center"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Log in"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
