import { useEffect, useState } from "react";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Trash2, Send } from "lucide-react";

interface Comment {
  _id: string;
  text: string;
  username: string;
  user: string;
  createdAt: string;
}

const Comments = ({ pollId }: { pollId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await pollApi.getComments(pollId);
      if (Array.isArray(data)) setComments(data);
    } catch {
      // ignored
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pollId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await pollApi.addComment(pollId, { text });
      setText("");
      fetchComments();
    } catch {
      // ignored
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    await pollApi.deleteComment(commentId);
    fetchComments();
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-bold">Kommentarer ({comments.length})</h2>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv en kommentar..."
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}

      {comments.map((c) => (
        <div key={c._id} className="flex items-start justify-between border-b pb-2">
          <div>
            <span className="text-sm font-medium">{c.username}</span>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
          {user?.userId === c.user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(c._id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">Inga kommentarer ännu.</p>
      )}
    </div>
  );
};

export default Comments;
