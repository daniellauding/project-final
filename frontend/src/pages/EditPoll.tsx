import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Upload, Trash2, PlusCircle, Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";

const EditPoll = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [password, setPassword] = useState("");
  const [allowRemix, setAllowRemix] = useState(true);
  const [allowAnonymousVotes, setAllowAnonymousVotes] = useState(false);
  const [showWinner, setShowWinner] = useState(true);
  const [deadline, setDeadline] = useState("");
  const [pollStatus, setPollStatus] = useState("published");
  const [options, setOptions] = useState<{ label: string; imageUrl: string; videoUrl: string; audioUrl: string; embedUrl: string }[]>([]);
  const [pollId, setPollId] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      const data = await pollApi.getByShareId(shareId!);
      setTitle(data.title);
      setDescription(data.description || "");
      setVisibility(data.visibility || "public");
      setPassword(data.password || "");
      setAllowRemix(data.allowRemix !== false);
      setAllowAnonymousVotes(data.allowAnonymousVotes === true);
      setShowWinner(data.showWinner !== false);
      setDeadline(data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : "");
      setPollStatus(data.status || "published");
      setPollId(data._id);
      setOptions(
        data.options.map((opt: any) => ({
          label: opt.label || "",
          imageUrl: opt.imageUrl || "",
          videoUrl: opt.videoUrl || "",
          audioUrl: opt.audioUrl || "",
          embedUrl: opt.embedUrl || "",
        }))
      );
    };
    fetchPoll();
  }, [shareId]);

  const updateOption = (index: number, field: string, value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const data = await pollApi.upload(file);
      if (data.fileType === "video") {
        updateOption(index, "videoUrl", data.url);
      } else if (data.fileType === "audio") {
        updateOption(index, "audioUrl", data.url);
      } else {
        updateOption(index, "imageUrl", data.url || data.imageUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pollApi.update(pollId, {
        title,
        description,
        visibility,
        status: pollStatus,
        allowRemix,
        allowAnonymousVotes,
        showWinner,
        deadline: deadline || undefined,
        password,
        options: options.map((opt) => ({
          label: opt.label,
          imageUrl: opt.imageUrl,
          videoUrl: opt.videoUrl,
          audioUrl: opt.audioUrl,
          embedUrl: opt.embedUrl,
        })),
      });
      navigate(`/poll/${shareId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="container mx-auto p-8">Logga in först.</div>;

  return (
    <div className="container mx-auto p-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Redigera poll</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Beskrivning</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <Label>Synlighet</Label>
          <div className="flex gap-2">
            {[
              { value: "public", label: "Publik", icon: Eye, desc: "Alla kan se och hitta din poll" },
              { value: "unlisted", label: "Olistad", icon: EyeOff, desc: "Bara de med länken kan se den" },
              { value: "private", label: "Privat", icon: Lock, desc: "Bara du kan se den" },
            ].map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setVisibility(v.value)}
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition text-sm ${
                  visibility === v.value ? "border-primary bg-primary/5" : "hover:bg-accent"
                }`}
              >
                <v.icon className="h-4 w-4" />
                {v.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {visibility === "public" && "Alla kan se och hitta din poll"}
            {visibility === "unlisted" && "Bara de med länken kan se den"}
            {visibility === "private" && "Bara du kan se den"}
          </p>
        </div>

        {/* Password (for unlisted/public) */}
        {visibility !== "private" && (
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Lösenord (valfritt)
            </Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lämna tomt för inget lösenord"
            />
            <p className="text-xs text-muted-foreground">
              Kräver lösenord för att se och rösta
            </p>
          </div>
        )}

        {/* Allow remix toggle */}
        {/* Poll settings */}
        <div className="space-y-3 rounded-lg border p-4">
          <Label>Inställningar</Label>

          {/* Close/open poll */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <div className="flex gap-1">
              {[
                { value: "published", label: "Öppen" },
                { value: "closed", label: "Stängd" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setPollStatus(s.value)}
                  className={`px-3 py-1 rounded text-xs transition ${
                    pollStatus === s.value ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {pollStatus === "closed" && (
            <p className="text-xs text-muted-foreground">Inga nya röster kan läggas</p>
          )}

          {/* Deadline */}
          <div className="space-y-1">
            <label className="text-sm flex items-center justify-between">
              Deadline (valfri)
              {deadline && (
                <button type="button" onClick={() => setDeadline("")} className="text-xs text-muted-foreground underline">
                  Ta bort
                </button>
              )}
            </label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            {deadline && new Date(deadline) < new Date() && (
              <p className="text-xs text-destructive">Deadline har passerat — inga nya röster</p>
            )}
          </div>

          {/* Toggles */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showWinner} onChange={(e) => setShowWinner(e.target.checked)} className="rounded" />
            <span className="text-sm">Visa vinnare</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allowAnonymousVotes} onChange={(e) => setAllowAnonymousVotes(e.target.checked)} className="rounded" />
            <span className="text-sm">Tillåt anonym röstning</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allowRemix} onChange={(e) => setAllowRemix(e.target.checked)} className="rounded" />
            <span className="text-sm">Tillåt remix</span>
          </label>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Label>Alternativ ({options.length} st)</Label>
          {options.map((opt, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                  <Input
                    value={opt.label}
                    onChange={(e) => updateOption(i, "label", e.target.value)}
                    placeholder={`Alternativ ${i + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {opt.imageUrl ? (
                  <div className="relative">
                    <img src={opt.imageUrl} alt={opt.label} className="w-full h-40 object-cover rounded" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => updateOption(i, "imageUrl", "")}>
                      Ta bort
                    </Button>
                  </div>
                ) : opt.videoUrl ? (
                  <div className="relative">
                    <video src={opt.videoUrl} controls className="w-full h-40 rounded" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => updateOption(i, "videoUrl", "")}>
                      Ta bort
                    </Button>
                  </div>
                ) : opt.audioUrl ? (
                  <div className="relative">
                    <audio src={opt.audioUrl} controls className="w-full" />
                    <Button type="button" variant="destructive" size="sm" className="mt-1" onClick={() => updateOption(i, "audioUrl", "")}>
                      Ta bort
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      capture="environment"
                      className="hidden"
                      id={`edit-file-${i}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(i, file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`edit-file-${i}`)?.click()}
                      disabled={uploading === i}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading === i ? "Laddar upp..." : "Ladda upp fil"}
                    </Button>
                  </div>
                )}

                <Input
                  value={opt.embedUrl}
                  onChange={(e) => updateOption(i, "embedUrl", e.target.value)}
                  placeholder="Embed-URL (valfri)"
                />
                {opt.embedUrl && toEmbedUrl(opt.embedUrl) ? (
                  <iframe
                    src={toEmbedUrl(opt.embedUrl)!}
                    title={`Preview ${opt.label}`}
                    className="w-full h-48 rounded border"
                    allowFullScreen
                  />
                ) : opt.embedUrl ? (
                  <div className="flex items-center gap-2 p-3 rounded border bg-muted text-sm">
                    <span className="truncate flex-1">{opt.embedUrl}</span>
                    <a href={opt.embedUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline shrink-0">
                      Öppna
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addOption} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Lägg till alternativ
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
      </form>
    </div>
  );
};

export default EditPoll;
