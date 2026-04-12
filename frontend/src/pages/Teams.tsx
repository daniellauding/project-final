import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Copy,
  Trash2,
  UserPlus,
  FolderOpen,
  Link as LinkIcon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.accessToken || "";
};

interface Member {
  user: { _id: string; username: string; avatarUrl?: string };
  role: string;
  joinedAt?: string;
}

interface Poll {
  _id: string;
  name?: string;
  title?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  polls?: Poll[];
}

interface Team {
  _id: string;
  name: string;
  description?: string;
  owner?: string;
  members: Member[];
  inviteCode?: string;
  avatarUrl?: string;
  projects?: Project[];
}

// ─── Team List View ─────────────────────────────────────────────────────────

function TeamList() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/teams`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not load teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: createName, description: createDesc }),
      });
      if (!res.ok) throw new Error("Failed to create team");
      toast.success("Team created");
      setCreateName("");
      setCreateDesc("");
      setShowCreate(false);
      fetchTeams();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not create team"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ inviteCode: joinCode }),
      });
      if (!res.ok) throw new Error("Failed to join team");
      toast.success("Joined team");
      setJoinCode("");
      setShowJoin(false);
      fetchTeams();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not join team");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teams</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowJoin(!showJoin);
              setShowCreate(false);
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Join Team
          </Button>
          <Button
            onClick={() => {
              setShowCreate(!showCreate);
              setShowJoin(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-lg border bg-card p-4 space-y-3"
        >
          <h2 className="font-semibold">Create a new team</h2>
          <Input
            placeholder="Team name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            required
          />
          <Input
            placeholder="Description (optional)"
            value={createDesc}
            onChange={(e) => setCreateDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {showJoin && (
        <form
          onSubmit={handleJoin}
          className="mb-6 rounded-lg border bg-card p-4 space-y-3"
        >
          <h2 className="font-semibold">Join a team with invite code</h2>
          <Input
            placeholder="Paste invite code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Joining..." : "Join"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowJoin(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {teams.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No teams yet</p>
          <p className="text-sm text-muted-foreground">
            Create a team or join one with an invite code.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((team) => (
            <button
              key={team._id}
              onClick={() => navigate(`/teams/${team._id}`)}
              className="rounded-lg border bg-card p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-3">
                {team.avatarUrl ? (
                  <img
                    src={team.avatarUrl}
                    alt={team.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {team.members.length}{" "}
                    {team.members.length === 1 ? "member" : "members"}
                  </span>
                </div>
              </div>
              {team.description && (
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {team.description}
                </p>
              )}
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map((m) =>
                  m.user.avatarUrl ? (
                    <img
                      key={m.user._id}
                      src={m.user.avatarUrl}
                      alt={m.user.username}
                      className="h-7 w-7 rounded-full border-2 border-card object-cover"
                    />
                  ) : (
                    <div
                      key={m.user._id}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium"
                    >
                      {m.user.username.charAt(0).toUpperCase()}
                    </div>
                  )
                )}
                {team.members.length > 5 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                    +{team.members.length - 5}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Team Detail View ───────────────────────────────────────────────────────

function TeamDetail({ teamId }: { teamId: string }) {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteUsername, setInviteUsername] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch team");
      const data = await res.json();
      setTeam(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not load team");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const isOwner = user && team?.owner === (user as { _id?: string })?._id;

  const copyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      toast.success("Invite code copied");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ username: inviteUsername }),
      });
      if (!res.ok) throw new Error("Failed to invite user");
      toast.success(`Invited ${inviteUsername}`);
      setInviteUsername("");
      fetchTeam();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not invite user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: string, username: string) => {
    if (!confirm(`Remove ${username} from the team?`)) return;
    try {
      const res = await fetch(
        `${API_URL}/teams/${teamId}/members/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (!res.ok) throw new Error("Failed to remove member");
      toast.success(`Removed ${username}`);
      fetchTeam();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove member"
      );
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: projectName, description: projectDesc }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      toast.success("Project created");
      setProjectName("");
      setProjectDesc("");
      setShowProjectForm(false);
      fetchTeam();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not create project"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <p className="text-lg text-muted-foreground">Team not found.</p>
        <Link to="/teams" className="text-primary underline">
          Back to teams
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/teams"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; All Teams
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{team.name}</h1>
        {team.description && (
          <p className="mt-1 text-muted-foreground">{team.description}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Members */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5" />
              Members ({team.members.length})
            </h2>
            <div className="space-y-2">
              {team.members.map((m) => (
                <div
                  key={m.user._id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    {m.user.avatarUrl ? (
                      <img
                        src={m.user.avatarUrl}
                        alt={m.user.username}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {m.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{m.user.username}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {m.role}
                        {m.joinedAt &&
                          ` · Joined ${new Date(m.joinedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  {isOwner && m.user._id !== (user as { _id?: string })?._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveMember(m.user._id, m.user.username)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FolderOpen className="h-5 w-5" />
                Projects
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjectForm(!showProjectForm)}
              >
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Button>
            </div>

            {showProjectForm && (
              <form
                onSubmit={handleCreateProject}
                className="mb-4 rounded-lg border bg-card p-4 space-y-3"
              >
                <Input
                  placeholder="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting} size="sm">
                    {submitting ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProjectForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {!team.projects || team.projects.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <FolderOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No projects yet. Create one to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {project.polls?.length || 0} polls
                      </span>
                    </div>
                    {project.description && (
                      <p className="mb-2 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                    {project.polls && project.polls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.polls.map((poll) => (
                          <span
                            key={poll._id}
                            className="rounded-md bg-muted px-2 py-1 text-xs"
                          >
                            {poll.name || poll.title || "Untitled poll"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Invite */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <UserPlus className="h-4 w-4" />
              Invite Members
            </h3>

            {team.inviteCode && (
              <div className="mb-4">
                <label className="mb-1 block text-xs text-muted-foreground">
                  Invite Code
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={team.inviteCode}
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={copyInviteCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                Invite by username
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Username"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={submitting}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Teams() {
  const { user } = useAuth();
  const { teamId } = useParams<{ teamId?: string }>();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Sign in to view teams</h2>
        <p className="mb-4 text-muted-foreground">
          You need to be logged in to create or join teams.
        </p>
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (teamId) {
    return <TeamDetail teamId={teamId} />;
  }

  return <TeamList />;
}
