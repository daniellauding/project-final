import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Upload, Trash2, PlusCircle, Eye, EyeOff, Lock, KeyRound, Clipboard, X } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";
import { toast } from "sonner";

type Option = { label: string; imageUrl: string; videoUrl: string; audioUrl: string; embedUrl: string; fileUrl: string; fileName: string };

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
  const [options, setOptions] = useState<Option[]>([]);
  const [pollId, setPollId] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Set<number>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Map<number, number>>(new Map());
  const abortMapRef = useRef<Map<number, () => void>>(new Map());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const activeCardRef = useRef(activeCard);
  activeCardRef.current = activeCard;
  const claimedRef = useRef<Set<number>>(new Set());

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
      const opts = data.options.map((opt: any) => ({
        label: opt.label || "",
        imageUrl: opt.imageUrl || "",
        videoUrl: opt.videoUrl || "",
        audioUrl: opt.audioUrl || "",
        embedUrl: opt.embedUrl || "",
        fileUrl: opt.fileUrl || "",
        fileName: opt.fileName || "",
      }));
      setOptions(opts);
      optionsRef.current = opts;
    };
    fetchPoll();
  }, [shareId]);

  const updateOption = (index: number, fields: Record<string, string>) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      optionsRef.current = updated;
      return updated;
    });
  };

  const addOption = () => {
    setOptions((prev) => {
      const updated = [...prev, { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" }];
      optionsRef.current = updated;
      return updated;
    });
  };

  const removeOption = (index: number) => {
    setOptions((prev) => {
      if (prev.length <= 2) return prev;
      const updated = prev.filter((_, i) => i !== index);
      optionsRef.current = updated;
      return updated;
    });
  };

  const handleFileUpload = async (index: number, file: File) => {
    claimedRef.current.add(index);
    setUploading((prev) => new Set(prev).add(index));
    setUploadProgress((prev) => new Map(prev).set(index, 0));

    const { promise, abort } = pollApi.uploadWithProgress(file, ({ percent }) => {
      setUploadProgress((prev) => new Map(prev).set(index, percent));
    });
    abortMapRef.current.set(index, abort);

    try {
      const data = await promise;
      if (data.fileType === "video") updateOption(index, { videoUrl: data.url });
      else if (data.fileType === "audio") updateOption(index, { audioUrl: data.url });
      else if (data.fileType === "file") updateOption(index, { fileUrl: data.url, fileName: file.name });
      else updateOption(index, { imageUrl: data.url || data.imageUrl });
    } catch (err: any) {
      if (err?.message !== "Upload cancelled") toast("Upload failed");
    } finally {
      claimedRef.current.delete(index);
      abortMapRef.current.delete(index);
      setUploading((prev) => { const next = new Set(prev); next.delete(index); return next; });
      setUploadProgress((prev) => { const next = new Map(prev); next.delete(index); return next; });
    }
  };

  const cancelUpload = (index: number) => {
    const abort = abortMapRef.current.get(index);
    if (abort) abort();
    toast("Upload cancelled");
  };

  const uploadRef = useRef(handleFileUpload);
  uploadRef.current = handleFileUpload;

  // Global paste: selected card → paste there; otherwise next empty; otherwise new card
  useEffect(() => {
    if (!pollId) return; // wait for poll to load

    const isSlotEmpty = (o: Option, idx: number) =>
      !o.imageUrl && !o.videoUrl && !o.audioUrl && !o.embedUrl && !o.fileUrl && !claimedRef.current.has(idx);

    const findTarget = (): number => {
      const active = activeCardRef.current;
      if (active !== null && active < optionsRef.current.length) return active;
      const opts = optionsRef.current;
      const emptyIdx = opts.findIndex((o, idx) => isSlotEmpty(o, idx));
      if (emptyIdx >= 0) return emptyIdx;
      const newOpt: Option = { label: `Option ${opts.length + 1}`, imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" };
      const updated = [...opts, newOpt];
      setOptions(updated);
      optionsRef.current = updated;
      return opts.length;
    };

    const onPaste = (e: ClipboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/") || item.type.startsWith("video/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) return;
          const targetIdx = findTarget();
          uploadRef.current(targetIdx, file);
          toast(`Pasted into Option ${targetIdx + 1}`);
          return;
        }
      }

      const text = e.clipboardData?.getData("text/plain")?.trim();
      if (text && /^https?:\/\//.test(text)) {
        e.preventDefault();
        const targetIdx = findTarget();
        const opts = optionsRef.current;
        const updated = [...opts];
        updated[targetIdx] = { ...updated[targetIdx], embedUrl: text };
        setOptions(updated);
        optionsRef.current = updated;
        toast(`URL pasted into Option ${targetIdx + 1}`);
      }
    };

    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [pollId]);

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
          fileUrl: opt.fileUrl,
          fileName: opt.fileName,
        })),
      });
      navigate(`/poll/${shareId}`);
    } catch {
      toast("Failed to save poll");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="container mx-auto p-8">Log in first.</div>;

  const goBack = () => navigate(`/poll/${shareId}`);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [shareId]);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={goBack}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit poll"
        className="absolute inset-y-0 right-0 w-full max-w-2xl bg-background border-l shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-background z-10">
          <h1 className="text-lg font-medium">Edit poll</h1>
          <button onClick={goBack} aria-label="Close editor" className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <Label>Visibility</Label>
          <div className="flex gap-2">
            {[
              { value: "public", label: "Public", icon: Eye, desc: "Anyone can see and find your poll" },
              { value: "unlisted", label: "Unlisted", icon: EyeOff, desc: "Only people with the link can see it" },
              { value: "private", label: "Private", icon: Lock, desc: "Only you can see it" },
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
            {visibility === "public" && "Anyone can see and find your poll"}
            {visibility === "unlisted" && "Only people with the link can see it"}
            {visibility === "private" && "Only you can see it"}
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Password (optional)
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for no password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Requires password to view and vote
          </p>
        </div>

        {/* Poll settings */}
        <div className="space-y-3 rounded-lg border p-4">
          <Label>Settings</Label>

          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <div className="flex gap-1">
              {[
                { value: "published", label: "Open" },
                { value: "closed", label: "Closed" },
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
            <p className="text-xs text-muted-foreground">No new votes can be cast</p>
          )}

          <div className="space-y-1">
            <label className="text-sm flex items-center justify-between">
              Deadline (optional)
              {deadline && (
                <button type="button" onClick={() => setDeadline("")} className="text-xs text-muted-foreground underline">
                  Remove
                </button>
              )}
            </label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-label="Deadline"
            />
            {deadline && new Date(deadline) < new Date() && (
              <p className="text-xs text-destructive">Deadline has passed — no new votes</p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showWinner} onChange={(e) => setShowWinner(e.target.checked)} className="rounded" />
            <span className="text-sm">Show winner</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allowAnonymousVotes} onChange={(e) => setAllowAnonymousVotes(e.target.checked)} className="rounded" />
            <span className="text-sm">Allow anonymous voting</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allowRemix} onChange={(e) => setAllowRemix(e.target.checked)} className="rounded" />
            <span className="text-sm">Allow remix</span>
          </label>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options ({options.length} total)</Label>
            {activeCard !== null && (
              <span className="text-xs text-muted-foreground">Pasting into Option {activeCard + 1}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clipboard className="h-3 w-3" /> Paste images or URLs with Cmd+V / Ctrl+V
          </p>
          {options.map((opt, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-colors ${
                activeCard === i ? "ring-2 ring-foreground/20 border-foreground" : ""
              }`}
              onClick={() => setActiveCard(activeCard === i ? null : i)}
            >
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                  <Input
                    value={opt.label}
                    onChange={(e) => updateOption(i, { label: e.target.value })}
                    placeholder={`Option ${i + 1}`}
                    aria-label={`Option ${i + 1} label`}
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove option ${i + 1}`} onClick={(e) => { e.stopPropagation(); removeOption(i); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {opt.imageUrl ? (
                  <div className="relative">
                    <img src={opt.imageUrl} alt={opt.label} className="w-full h-40 object-cover rounded" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); updateOption(i, { imageUrl: "" }); }}>
                      Remove
                    </Button>
                  </div>
                ) : opt.videoUrl ? (
                  <div className="relative">
                    <video src={opt.videoUrl} controls className="w-full h-40 rounded bg-black" onClick={(e) => e.stopPropagation()} />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); updateOption(i, { videoUrl: "" }); }}>
                      Remove
                    </Button>
                  </div>
                ) : opt.audioUrl ? (
                  <div className="relative p-3 bg-muted/60 rounded flex flex-col items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    <audio src={opt.audioUrl} controls className="w-full" onClick={(e) => e.stopPropagation()} />
                    <Button type="button" variant="destructive" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); updateOption(i, { audioUrl: "" }); }}>
                      Remove
                    </Button>
                  </div>
                ) : opt.fileUrl ? (
                  <div className="relative">
                    {opt.fileUrl.toLowerCase().includes('.pdf') ? (
                      <iframe src={opt.fileUrl} title={opt.fileName || "PDF"} className="w-full h-40 rounded border-0" />
                    ) : (
                      <div className="p-4 bg-muted/60 rounded flex items-center gap-3">
                        <span className="inline-block px-2 py-1 rounded bg-muted-foreground/10 text-xs font-mono font-bold uppercase tracking-wide">
                          {(opt.fileName || opt.fileUrl).split('.').pop()?.slice(0, 6) || "file"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{opt.fileName || "File"}</p>
                          <a href={opt.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Open file</a>
                        </div>
                      </div>
                    )}
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); updateOption(i, { fileUrl: "", fileName: "" }); }}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragOver === i ? "border-primary bg-primary/10" : "border-border/60"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(i); }}
                    onDragEnter={(e) => { e.preventDefault(); setDragOver(i); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => {
                      e.preventDefault(); e.stopPropagation(); setDragOver(null);
                      const file = e.dataTransfer?.files?.[0];
                      if (file) handleFileUpload(i, file);
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.md,.txt,.csv,.sketch,.fig,.zip,.ppt,.pptx,.xls,.xlsx"
                      capture="environment"
                      className="hidden"
                      id={`edit-file-${i}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(i, file);
                      }}
                    />
                    {uploading.has(i) ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Progress value={uploadProgress.get(i) ?? 0} className="w-full" />
                        <span className="text-xs text-muted-foreground">{uploadProgress.get(i) ?? 0}%</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); cancelUpload(i); }}
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); document.getElementById(`edit-file-${i}`)?.click(); }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {dragOver === i ? "Drop here" : "Drop or click to upload"}
                      </Button>
                    )}
                  </div>
                )}

                <Input
                  value={opt.embedUrl}
                  onChange={(e) => updateOption(i, { embedUrl: e.target.value })}
                  placeholder="Embed URL (optional)"
                  aria-label={`Option ${i + 1} embed URL`}
                  onClick={(e) => e.stopPropagation()}
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
                      Open
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addOption} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add option
          </Button>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default EditPoll;
