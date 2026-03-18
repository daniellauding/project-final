import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Upload, Trash2, PlusCircle, Eye, EyeOff, Lock, KeyRound, Clipboard, X, Type, ImageIcon } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";
import { toast } from "sonner";
import TextFilePreview, { isTextFile } from "../components/TextFilePreview";

type Option = { label: string; imageUrl: string; videoUrl: string; audioUrl: string; embedUrl: string; fileUrl: string; fileName: string; textContent: string; coverUrl: string };

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
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
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
      setThumbnailUrl(data.thumbnailUrl || "");
      setPollId(data._id);
      const opts = data.options.map((opt: any) => ({
        label: opt.label || "",
        imageUrl: opt.imageUrl || "",
        videoUrl: opt.videoUrl || "",
        audioUrl: opt.audioUrl || "",
        embedUrl: opt.embedUrl || "",
        fileUrl: opt.fileUrl || "",
        fileName: opt.fileName || "",
        textContent: opt.textContent || "",
        coverUrl: opt.coverUrl || "",
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
      const updated = [...prev, { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "", textContent: "", coverUrl: "" }];
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

  const TEXT_EXTS = [".md", ".txt", ".csv"];
  const isTextFileLocal = (name: string) => TEXT_EXTS.some((ext) => name.toLowerCase().endsWith(ext));

  const handleCoverUpload = async (index: number, file: File) => {
    const key = index + 1000;
    setUploading((prev) => new Set(prev).add(key));
    setUploadProgress((prev) => new Map(prev).set(key, 0));

    const { promise, abort } = pollApi.uploadWithProgress(file, ({ percent }) => {
      setUploadProgress((prev) => new Map(prev).set(key, percent));
    });
    abortMapRef.current.set(key, abort);

    try {
      const data = await promise;
      updateOption(index, { coverUrl: data.url || data.imageUrl });
    } catch (err: any) {
      if (err?.message !== "Upload cancelled") toast("Cover upload failed");
    } finally {
      abortMapRef.current.delete(key);
      setUploading((prev) => { const next = new Set(prev); next.delete(key); return next; });
      setUploadProgress((prev) => { const next = new Map(prev); next.delete(key); return next; });
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (isTextFileLocal(file.name)) {
      try {
        const text = await file.text();
        updateOption(index, { textContent: text, fileName: file.name });
        if (options[index]?.label === "" || options[index]?.label.startsWith("Option ")) {
          updateOption(index, { label: file.name.replace(/\.[^.]+$/, "") });
        }
      } catch {
        toast("Could not read file");
      }
      return;
    }

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
      !o.imageUrl && !o.videoUrl && !o.audioUrl && !o.embedUrl && !o.fileUrl && !o.textContent && !claimedRef.current.has(idx);

    const findTarget = (): number => {
      const active = activeCardRef.current;
      if (active !== null && active < optionsRef.current.length) return active;
      const opts = optionsRef.current;
      const emptyIdx = opts.findIndex((o, idx) => isSlotEmpty(o, idx));
      if (emptyIdx >= 0) return emptyIdx;
      const newOpt: Option = { label: `Option ${opts.length + 1}`, imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "", textContent: "", coverUrl: "" };
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
        thumbnailUrl,
        options: options.map((opt) => ({
          label: opt.label,
          imageUrl: opt.imageUrl,
          videoUrl: opt.videoUrl,
          audioUrl: opt.audioUrl,
          embedUrl: opt.embedUrl,
          fileUrl: opt.fileUrl,
          fileName: opt.fileName,
          textContent: opt.textContent,
          coverUrl: opt.coverUrl,
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
    <div className="fixed inset-0 z-50 bg-black/20" onClick={goBack}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit poll"
        className="absolute inset-y-0 right-0 w-full max-w-md bg-background border-l shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200"
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

        {/* Poll thumbnail */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Cover image
          </Label>
          <p className="text-xs text-muted-foreground">
            Featured image for cards and feed. Recommended: 1200×800px, JPG/PNG, max 5 MB. Falls back to first option's image if empty.
          </p>
          {thumbnailUrl ? (
            <div className="relative rounded-lg overflow-hidden">
              <img src={thumbnailUrl} alt="Poll thumbnail" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setThumbnailUrl("")}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs hover:bg-black/80 transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingThumb ? "border-primary/50" : "border-border/60 hover:border-primary/30"}`}>
              {uploadingThumb ? (
                <span className="text-sm text-muted-foreground">Uploading...</span>
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground">Drop or click to upload cover image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    toast("Image too large — max 5 MB");
                    return;
                  }
                  if (!file.type.startsWith("image/")) {
                    toast("Only image files (JPG, PNG, WebP)");
                    return;
                  }
                  setUploadingThumb(true);
                  try {
                    const data = await pollApi.upload(file);
                    if (data.url || data.imageUrl) {
                      setThumbnailUrl(data.url || data.imageUrl);
                    }
                  } catch {
                    toast("Thumbnail upload failed");
                  } finally {
                    setUploadingThumb(false);
                  }
                }}
              />
            </label>
          )}
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

                {(() => {
                  const hasMedia = opt.imageUrl || opt.videoUrl || opt.audioUrl || opt.fileUrl || opt.textContent;
                  const coverBtn = (idx: number) => (
                    uploading.has(idx + 1000) ? (
                      <span className="px-2 py-0.5 rounded bg-foreground/10 text-[10px] text-muted-foreground flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {uploadProgress.get(idx + 1000) ?? 0}%
                        <button type="button" onClick={() => { const a = abortMapRef.current.get(idx + 1000); if (a) a(); }} className="underline">cancel</button>
                      </span>
                    ) : (
                      <label className="px-2 py-0.5 rounded bg-foreground/10 text-[10px] cursor-pointer hover:bg-foreground/20 transition text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                        + Cover
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0]; if (f) handleCoverUpload(idx, f);
                        }} />
                      </label>
                    )
                  );
                  const removeBtn = (fields: Record<string, string>) => (
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); updateOption(i, fields); }}>
                      Remove
                    </Button>
                  );
                  const coverPreview = opt.coverUrl ? (
                    <div className="relative h-32 rounded overflow-hidden mb-1">
                      <img src={opt.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); updateOption(i, { coverUrl: "" }); }}
                        className="absolute top-1 left-1 px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">Remove cover</button>
                    </div>
                  ) : null;

                  if (opt.imageUrl) return (
                    <div className="relative">
                      <img src={opt.imageUrl} alt={opt.label} className="w-full h-40 object-cover rounded" />
                      {removeBtn({ imageUrl: "", coverUrl: "" })}
                    </div>
                  );
                  if (opt.videoUrl) return (
                    <div className="relative">
                      {coverPreview || <video src={opt.videoUrl} controls className="w-full h-40 rounded bg-black" onClick={(e) => e.stopPropagation()} />}
                      <div className="flex items-center justify-between mt-1">
                        {!opt.coverUrl && coverBtn(i)}
                      </div>
                      {removeBtn({ videoUrl: "", coverUrl: "" })}
                    </div>
                  );
                  if (opt.audioUrl) return (
                    <div className="relative">
                      {coverPreview}
                      <div className="p-3 bg-muted/60 rounded flex flex-col items-center gap-2">
                        {!opt.coverUrl && <span className="text-2xl">🎵</span>}
                        <audio src={opt.audioUrl} controls className="w-full" onClick={(e) => e.stopPropagation()} />
                        {!opt.coverUrl && coverBtn(i)}
                      </div>
                      {removeBtn({ audioUrl: "", coverUrl: "" })}
                    </div>
                  );
                  if (opt.textContent) return (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      {coverPreview}
                      <div className="flex items-center justify-between px-3 py-1.5 border border-border/40 rounded-t bg-muted/30">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-foreground/10 text-[10px] font-mono font-bold uppercase tracking-wide">
                            {(opt.fileName || "").split('.').pop() || "md"}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">{opt.fileName}</span>
                        </div>
                        {!opt.coverUrl && coverBtn(i)}
                      </div>
                      <textarea
                        value={opt.textContent}
                        onChange={(e) => updateOption(i, { textContent: e.target.value })}
                        className="w-full h-40 p-3 text-sm font-mono bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 border border-t-0 border-border/40 rounded-b"
                        placeholder="Paste or edit content..."
                      />
                      {removeBtn({ textContent: "", fileName: "", coverUrl: "" })}
                    </div>
                  );
                  if (opt.fileUrl) return (
                    <div className="relative">
                      {opt.coverUrl ? coverPreview : isTextFile(opt.fileUrl, opt.fileName) ? (
                        <div className="relative">
                          <TextFilePreview url={opt.fileUrl} fileName={opt.fileName} className="h-40 rounded" />
                          <div className="absolute bottom-2 left-2">{coverBtn(i)}</div>
                        </div>
                      ) : opt.fileUrl.toLowerCase().includes('.pdf') ? (
                        <div className="relative">
                          <iframe src={opt.fileUrl} title={opt.fileName || "PDF"} className="w-full h-40 rounded border-0" />
                          <div className="absolute bottom-2 left-2">{coverBtn(i)}</div>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/60 rounded flex items-center gap-3">
                          <span className="inline-block px-2 py-1 rounded bg-muted-foreground/10 text-xs font-mono font-bold uppercase tracking-wide">
                            {(opt.fileName || opt.fileUrl).split('.').pop()?.slice(0, 6) || "file"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{opt.fileName || "File"}</p>
                            <a href={opt.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Open file</a>
                          </div>
                          {coverBtn(i)}
                        </div>
                      )}
                      {removeBtn({ fileUrl: "", fileName: "", coverUrl: "" })}
                    </div>
                  );

                  // Empty — upload zone
                  return (
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
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); document.getElementById(`edit-file-${i}`)?.click(); }}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {dragOver === i ? "Drop here" : "Drop or click to upload"}
                          </Button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateOption(i, { textContent: " ", fileName: "text.md" }); }}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/5 hover:bg-foreground/10 text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition"
                          >
                            <Type className="h-3 w-3" /> Write text
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

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
