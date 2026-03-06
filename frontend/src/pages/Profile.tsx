import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { pollApi } from "../api/polls";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { LogOut, Trash2, PlusCircle, X, Pencil, Check, Camera } from "lucide-react";
import { toast } from "sonner";

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
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const data = await pollApi.getAll(1, true);
        if (data.results) {
          setPolls(data.results.filter((p: Poll) => p.creator === user?.userId));
        }
      } catch {
        toast("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyPolls();
    else setLoading(false);
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? Your account and all polls will be permanently deleted.")) return;
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken;
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      logout();
    } catch {
      toast("Failed to delete account");
    }
  };

  const startEdit = () => {
    setEditName(user?.username || "");
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!editName.trim() || editName.trim() === user?.username) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const token = user?.accessToken || "";
      await authApi.updateProfile(token, { username: editName.trim() });
      updateUser({ username: editName.trim() });
      toast("Profile updated");
      setEditing(false);
    } catch {
      toast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const data = await pollApi.upload(file);
      if (!data.success) {
        toast(data.error || "Upload failed");
        return;
      }
      const url = data.url || data.imageUrl;
      if (!url) {
        toast("No URL returned from upload");
        return;
      }
      const token = user?.accessToken || "";
      const result = await authApi.updateProfile(token, { avatarUrl: url });
      if (!result.success) {
        toast(result.error || "Could not save avatar");
        return;
      }
      updateUser({ avatarUrl: url });
      toast("Avatar updated");
    } catch (err: any) {
      toast(err?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-muted-foreground">Log in to see your profile.</p>
      </div>
    );
  }

  const totalVotes = polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0);
  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/welcome");
  }, [navigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goBack]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={goBack}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your profile"
        className="relative w-full max-w-md max-h-[85vh] bg-background rounded-2xl shadow-2xl overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={goBack} aria-label="Close profile" className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors z-10">
          <X className="h-4 w-4" />
        </button>
        <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <label aria-label="Change avatar" className="relative h-14 w-14 shrink-0 cursor-pointer group">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-medium">
              {user.username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-4 w-4 text-white" />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
            disabled={uploadingAvatar}
          />
          {uploadingAvatar && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </label>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 text-lg font-medium"
                autoFocus
                aria-label="Username"
                onKeyDown={(e) => { if (e.key === "Enter") saveProfile(); if (e.key === "Escape") setEditing(false); }}
                disabled={saving}
              />
              <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8" onClick={saveProfile} disabled={saving} aria-label="Save profile name">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium truncate">{user.username}</h1>
              <button onClick={startEdit} aria-label="Edit username" className="p-1 rounded hover:bg-accent transition-colors shrink-0">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mb-10 text-center">
        <div>
          <p className="text-2xl font-medium">{polls.length}</p>
          <p className="text-xs text-muted-foreground">Polls</p>
        </div>
        <div>
          <p className="text-2xl font-medium">{totalVotes}</p>
          <p className="text-xs text-muted-foreground">Total votes</p>
        </div>
      </div>

      {/* Polls list */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your polls</h2>
          <Button size="sm" variant="outline" asChild>
            <Link to="/create"><PlusCircle className="mr-1 h-3 w-3" /> New</Link>
          </Button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : polls.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any polls yet.</p>
            <Button asChild>
              <Link to="/create">Create your first poll</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {polls.map((poll) => (
              <Link
                key={poll._id}
                to={`/poll/${poll.shareId}`}
                className="flex items-center gap-3 rounded-lg p-3 -mx-3 hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                  {poll.options[0]?.imageUrl ? (
                    <img src={poll.options[0].imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-muted-foreground/40">
                      {poll.options.length}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{poll.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {poll.totalVotes || 0} votes · {poll.options.length} options
                  </p>
                </div>
                {poll.remixedFrom && (
                  <Badge variant="secondary" className="text-xs shrink-0">Remix</Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account actions */}
      <div className="border-t border-border/60 pt-6 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); goBack(); }}>
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDeleteAccount}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete account
        </Button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
