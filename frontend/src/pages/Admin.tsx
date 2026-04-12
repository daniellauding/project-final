import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Shield,
  Users,
  Flag,
  BarChart3,
  Trash2,
  ExternalLink,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.accessToken || "";
};

type Tab = "users" | "reports" | "polls";

interface UserRecord {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Report {
  _id: string;
  reason: string;
  message: string;
  targetType: string;
  targetId: string;
  reporter: string;
  reporterName: string;
  status: string;
  createdAt: string;
}

interface Poll {
  _id: string;
  title: string;
  creatorName: string;
  totalVotes: number;
  options: unknown[];
  shareId: string;
  createdAt: string;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("users");

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const authHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: getToken(),
  });

  // --- Fetch helpers ---

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reports`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/polls`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setPolls(data.results || []);
    } catch {
      toast.error("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    if (tab === "users") fetchUsers();
    if (tab === "reports") fetchReports();
    if (tab === "polls") fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  // --- Actions ---

  const changeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers();
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    }
  };

  const changeReportStatus = async (reportId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Report ${status}`);
        fetchReports();
      } else {
        toast.error("Failed to update report");
      }
    } catch {
      toast.error("Failed to update report");
    }
  };

  const deletePoll = async (pollId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/polls/${pollId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast.success("Poll deleted");
        fetchPolls();
      } else {
        toast.error("Failed to delete poll");
      }
    } catch {
      toast.error("Failed to delete poll");
    }
  };

  // --- Guard ---

  if (!user || user.role !== "admin") return null;

  // --- Tab config ---

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { key: "reports", label: "Reports", icon: <Flag className="h-4 w-4" /> },
    { key: "polls", label: "Polls", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "outline"}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2"
            >
              {t.icon}
              {t.label}
            </Button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground py-8 text-center">Loading...</p>
        )}

        {/* Users tab */}
        {tab === "users" && !loading && (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports tab */}
        {tab === "reports" && !loading && (
          <div className="space-y-4">
            {reports.length === 0 && (
              <p className="text-muted-foreground py-8 text-center">
                No reports found
              </p>
            )}
            {reports.map((r) => (
              <div
                key={r._id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{r.reason}</p>
                    {r.message && (
                      <p className="text-sm text-muted-foreground">
                        {r.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Reported by{" "}
                      <span className="font-medium text-foreground">
                        {r.reporterName}
                      </span>{" "}
                      on {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.status === "resolved"
                        ? "bg-green-500/15 text-green-700 dark:text-green-400"
                        : r.status === "dismissed"
                          ? "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400"
                          : "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.status !== "resolved" && r.status !== "dismissed" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => changeReportStatus(r._id, "resolved")}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => changeReportStatus(r._id, "dismissed")}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Polls tab */}
        {tab === "polls" && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.length === 0 && (
              <p className="text-muted-foreground py-8 text-center col-span-full">
                No polls found
              </p>
            )}
            {polls.map((p) => (
              <div
                key={p._id}
                className="rounded-lg border border-border p-4 flex flex-col gap-3"
              >
                <h3 className="font-semibold leading-snug">{p.title}</h3>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>By {p.creatorName}</p>
                  <p>
                    {p.totalVotes} vote{p.totalVotes !== 1 ? "s" : ""}
                  </p>
                  <p>{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1.5"
                    onClick={() => navigate(`/poll/${p.shareId}`)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1.5 text-destructive hover:bg-destructive/10"
                    onClick={() => deletePoll(p._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
