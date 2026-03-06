import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { PlusCircle, Trash2, ImagePlus, Eye, EyeOff, Lock, ArrowLeft, ArrowRight, Check, Clipboard, ChevronDown, X } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { toEmbedUrl } from "../utils/embedUrl";
import { toast } from "sonner";
import TextFilePreview, { isTextFile } from "../components/TextFilePreview";

const STEP_SLUGS = ["", "question", "publish"] as const;
const STEP_LABELS = ["Options", "Question", "Publish"] as const;

function slugToStep(slug: string | undefined): number {
  if (!slug) return 0;
  const idx = STEP_SLUGS.indexOf(slug as any);
  return idx > 0 ? idx : 0;
}

const CreatePoll = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { step: stepParam } = useParams<{ step?: string }>();
  const [searchParams] = useSearchParams();
  const remixFrom = searchParams.get("remix");
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = slugToStep(stepParam);
  const remixQs = remixFrom ? `?remix=${remixFrom}` : "";

  const goToStep = (s: number) => {
    const slug = STEP_SLUGS[s];
    navigate(slug ? `/create/${slug}${remixQs}` : `/create${remixQs}`, { replace: true });
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([
    { label: "Option 1", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" },
    { label: "Option 2", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" },
  ]);
  const [allowAnonymousVotes, setAllowAnonymousVotes] = useState(false);
  const [allowRemix, setAllowRemix] = useState(true);
  const [showWinner, setShowWinner] = useState(true);
  const [deadline, setDeadline] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [uploading, setUploading] = useState<Set<number>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Map<number, number>>(new Map());
  const abortMapRef = useRef<Map<number, () => void>>(new Map());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const activeCardRef = useRef<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRemix, setLoadingRemix] = useState(!!remixFrom);

  useEffect(() => {
    if (!remixFrom) return;
    const loadRemix = async () => {
      try {
        const data = await pollApi.getByShareId(remixFrom);
        setTitle(`Remix: ${data.title}`);
        setDescription(data.description || "");
        if (data.options) {
          setOptions(
            data.options.map((opt: any, i: number) => ({
              label: opt.label || `Option ${i + 1}`,
              imageUrl: opt.imageUrl || "",
              videoUrl: opt.videoUrl || "",
              audioUrl: opt.audioUrl || "",
              embedUrl: opt.embedUrl || "",
              fileUrl: opt.fileUrl || "",
              fileName: opt.fileName || "",
            }))
          );
        }
      } catch {
        toast("Failed to load remix");
      } finally {
        setLoadingRemix(false);
      }
    };
    loadRemix();
  }, [remixFrom]);

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>
        <p className="text-muted-foreground">You need to log in to create a poll.</p>
      </div>
    );
  }

  if (loadingRemix) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading remix...</div>;
  }

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
      const n = prev.length + 1;
      const updated = [...prev, { label: `Option ${n}`, imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" }];
      optionsRef.current = updated;
      return updated;
    });
    setTimeout(() => {
      scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
    }, 50);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => {
      if (prev.length <= 2) return prev;
      const updated = prev.filter((_, i) => i !== index);
      optionsRef.current = updated;
      return updated;
    });
  };

  // Track which option slots are claimed (uploading) so rapid pastes don't collide
  const claimedRef = useRef<Set<number>>(new Set());

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

  // Refs so the global paste listener always sees latest state
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const uploadRef = useRef(handleFileUpload);
  uploadRef.current = handleFileUpload;
  activeCardRef.current = activeCard;

  // Global paste: selected card → paste there; otherwise next empty; otherwise new card
  useEffect(() => {
    if (step !== 0) return;

    const isSlotEmpty = (o: typeof options[0], idx: number) =>
      !o.imageUrl && !o.videoUrl && !o.audioUrl && !o.embedUrl && !o.fileUrl && !claimedRef.current.has(idx);

    const findTarget = (): number => {
      // If a card is selected, always paste there (replace existing)
      const active = activeCardRef.current;
      if (active !== null && active < optionsRef.current.length) return active;
      // Otherwise find first empty slot
      const opts = optionsRef.current;
      const emptyIdx = opts.findIndex((o, idx) => isSlotEmpty(o, idx));
      if (emptyIdx >= 0) return emptyIdx;
      // All full — create a new option
      const n = opts.length + 1;
      const newOpt = { label: `Option ${n}`, imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" };
      const updated = [...opts, newOpt];
      setOptions(updated);
      optionsRef.current = updated;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
      }, 50);
      return opts.length; // index of the new option
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
  }, [step]);

  // Global drag-and-drop: route files to active/empty/new option (same logic as paste)
  useEffect(() => {
    if (step !== 0) return;

    const isSlotEmpty = (o: typeof options[0], idx: number) =>
      !o.imageUrl && !o.videoUrl && !o.audioUrl && !o.embedUrl && !o.fileUrl && !claimedRef.current.has(idx);

    const findTarget = (): number => {
      const active = activeCardRef.current;
      if (active !== null && active < optionsRef.current.length) return active;
      const opts = optionsRef.current;
      const emptyIdx = opts.findIndex((o, idx) => isSlotEmpty(o, idx));
      if (emptyIdx >= 0) return emptyIdx;
      const n = opts.length + 1;
      const newOpt = { label: `Option ${n}`, imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "", fileUrl: "", fileName: "" };
      const updated = [...opts, newOpt];
      setOptions(updated);
      optionsRef.current = updated;
      setTimeout(() => { scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" }); }, 50);
      return opts.length;
    };

    const onDragOver = (e: DragEvent) => { e.preventDefault(); };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;
      const targetIdx = findTarget();
      uploadRef.current(targetIdx, file);
      toast(`Dropped into Option ${targetIdx + 1}`);
    };

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => { document.removeEventListener("dragover", onDragOver); document.removeEventListener("drop", onDrop); };
  }, [step]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await pollApi.create({
        title: autoTitle(), description,
        options: options.map((opt) => ({
          label: opt.label, imageUrl: opt.imageUrl, videoUrl: opt.videoUrl,
          audioUrl: opt.audioUrl, externalUrl: "", embedUrl: opt.embedUrl,
          fileUrl: opt.fileUrl, fileName: opt.fileName,
        })),
        status: "published",
        visibility,
        allowAnonymousVotes,
        allowRemix,
        showWinner,
        ...(deadline ? { deadline } : {}),
        ...(password ? { password } : {}),
      });
      if (data.success) navigate(`/poll/${data.poll.shareId}`);
    } catch {
      toast("Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  };

  const hasMedia = (opt: typeof options[0]) => opt.imageUrl || opt.videoUrl || opt.audioUrl || opt.fileUrl;
  const filledOptions = options.filter((o) => o.label.trim());
  const canNextFromStep0 = filledOptions.length >= 2;
  const canNextFromStep1 = true; // title is optional, auto-filled if empty
  const canPublish = canNextFromStep0;

  const autoTitle = () => {
    if (title.trim().length >= 3) return title;
    const labels = options.map((o) => o.label.trim()).filter(Boolean);
    if (labels.length >= 2) return `${labels[0]} vs ${labels[1]}${labels.length > 2 ? ` + ${labels.length - 2} more` : ""}`;
    return "My poll";
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Step indicator */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1 md:gap-2 max-w-lg mx-auto">
            {STEP_LABELS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (i === 0) goToStep(0);
                  if (i === 1) goToStep(1);
                  if (i === 2 && canNextFromStep0) goToStep(2);
                }}
                className="flex items-center gap-2 flex-1 group"
              >
                <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors ${
                  i <= step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`text-sm hidden md:block transition-colors ${
                  i === step ? "font-medium text-foreground" : "text-muted-foreground"
                }`}>
                  {s}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-px ml-2 ${i < step ? "bg-foreground" : "bg-border"}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col">
        {/* Step 0: Options — horizontal scroll */}
        {step === 0 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center py-6 px-4">
              <h2 className="text-xl md:text-2xl tracking-tight">Add your options</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {filledOptions.length} of {options.length} filled · need at least 2
                {activeCard !== null && (
                  <span className="ml-1">· pasting into Option {activeCard + 1}</span>
                )}
              </p>
            </div>

            <div className="flex-1 flex items-center pb-4">
              <div
                ref={scrollRef}
                className="w-full overflow-x-auto snap-x snap-proximity flex gap-4 px-8 md:px-12 lg:px-16 pb-4 scrollbar-hide"
              >
                {options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveCard(activeCard === i ? null : i)}
                    className={`snap-start shrink-0 w-[75vw] sm:w-[300px] md:w-[320px] lg:w-[340px] rounded-2xl border-2 bg-card overflow-hidden flex flex-col cursor-pointer transition-colors ${
                      activeCard === i
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border/60"
                    }`}
                  >
                    {/* Media area */}
                    {hasMedia(opt) ? (
                      <div className="relative bg-muted">
                        {opt.imageUrl && (
                          <img src={opt.imageUrl} alt={opt.label} className="w-full h-48 object-cover" />
                        )}
                        {opt.videoUrl && (
                          <video src={opt.videoUrl} controls className="w-full h-48 bg-black" />
                        )}
                        {opt.audioUrl && (
                          <div className="p-4 h-48 flex flex-col items-center justify-center gap-2 bg-muted">
                            <span className="text-2xl">🎵</span>
                            <audio src={opt.audioUrl} controls className="w-full" />
                          </div>
                        )}
                        {opt.fileUrl && (() => {
                          if (isTextFile(opt.fileUrl, opt.fileName)) {
                            return <TextFilePreview url={opt.fileUrl} fileName={opt.fileName} className="h-48" />;
                          }
                          const isPdf = opt.fileUrl.toLowerCase().includes('.pdf');
                          return isPdf ? (
                            <iframe src={opt.fileUrl} title={opt.fileName || "PDF"} className="w-full h-48 border-0" />
                          ) : (
                            <div className="p-4 h-48 flex flex-col items-center justify-center gap-2">
                              <span className="inline-block px-2 py-1 rounded bg-muted-foreground/10 text-xs font-mono font-bold uppercase tracking-wide">
                                {(opt.fileName || opt.fileUrl).split('.').pop()?.slice(0, 6) || "file"}
                              </span>
                              <p className="text-sm font-medium truncate max-w-full">{opt.fileName || "File"}</p>
                              <a href={opt.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Open file</a>
                            </div>
                          );
                        })()}
                        <Button type="button" variant="destructive" size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            updateOption(i, { imageUrl: "", videoUrl: "", audioUrl: "", fileUrl: "", fileName: "" });
                          }}>
                          Remove
                        </Button>
                      </div>
                    ) : !opt.embedUrl ? (
                      <label
                        htmlFor={`file-${i}`}
                        className={`flex flex-col items-center justify-center h-48 cursor-pointer transition-colors ${
                          dragOver === i ? "bg-primary/10 border-primary" : "bg-muted/60 hover:bg-muted"
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
                        {uploading.has(i) ? (
                          <div className="flex flex-col items-center gap-2 w-full px-6" onClick={(e) => e.preventDefault()}>
                            <Progress value={uploadProgress.get(i) ?? 0} className="w-full" />
                            <span className="text-xs text-muted-foreground">{uploadProgress.get(i) ?? 0}%</span>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); cancelUpload(i); }}
                              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                            >
                              <X className="h-3 w-3" /> Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <ImagePlus className="h-8 w-8 text-muted-foreground/60 mb-2" />
                            <span className="text-sm text-muted-foreground">{dragOver === i ? "Drop file here" : "Drop, click, or paste"}</span>
                            <span className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                              <Clipboard className="h-3 w-3" /> Cmd+V / Ctrl+V
                            </span>
                          </>
                        )}
                        <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.md,.txt,.csv,.sketch,.fig,.zip,.ppt,.pptx,.xls,.xlsx" className="hidden" id={`file-${i}`}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(i, f); }} />
                      </label>
                    ) : null}

                    {/* Embed preview */}
                    {opt.embedUrl && toEmbedUrl(opt.embedUrl) && (
                      <iframe src={toEmbedUrl(opt.embedUrl)!} title={`Preview ${opt.label}`}
                        className="w-full h-48 border-b border-border/40" allowFullScreen />
                    )}

                    {/* Fields */}
                    <div className="p-4 space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-muted-foreground/40 w-6 shrink-0">{i + 1}</span>
                        <Input value={opt.label} onChange={(e) => updateOption(i, { label: e.target.value })}
                          placeholder={`Option ${i + 1}`}
                          aria-label={`Option ${i + 1} label`}
                          className="flex-1 placeholder:text-foreground/25 h-11 text-base" />
                      </div>
                      <Input value={opt.embedUrl} onChange={(e) => updateOption(i, { embedUrl: e.target.value })}
                        placeholder="Paste Figma, YouTube, or CodePen URL"
                        aria-label={`Option ${i + 1} embed URL`}
                        className="text-sm placeholder:text-foreground/25" />
                    </div>

                    {/* Remove */}
                    {options.length > 2 && (
                      <div className="px-4 pb-3">
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(i)}
                          className="text-muted-foreground hover:text-destructive w-full">
                          <Trash2 className="mr-1 h-3 w-3" /> Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add option card */}
                <button
                  type="button"
                  onClick={addOption}
                  className="snap-start shrink-0 w-[75vw] sm:w-[300px] md:w-[320px] lg:w-[340px] rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-3 hover:border-foreground/30 hover:bg-card/50 transition-colors min-h-[280px]"
                >
                  <PlusCircle className="h-8 w-8 text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground">Add option</span>
                </button>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 pb-2">
              {options.map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
              ))}
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/10" />
            </div>
          </div>
        )}

        {/* Step 1: Question */}
        {step === 1 && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl tracking-tight">
                  {remixFrom ? "Remix a poll" : "What are you deciding?"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Give your poll a clear question so voters know what to focus on.
                </p>
                {!title.trim() && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Skip this and we'll auto-name it "{autoTitle()}"
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder={autoTitle()}
                  aria-label="Poll title"
                  maxLength={100}
                  className="text-lg h-14 bg-card placeholder:text-foreground/25 rounded-xl"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); goToStep(2); } }}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add context for voters (optional)"
                  aria-label="Poll description"
                  maxLength={500} rows={3}
                  className="bg-card placeholder:text-foreground/25 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Settings + Publish */}
        {step === 2 && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl tracking-tight">Almost there</h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  {autoTitle()} · {filledOptions.length} options
                </p>
              </div>

              {/* Visibility */}
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <p className="text-sm font-medium">Who can see this?</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "public", icon: Eye, label: "Public", desc: "Visible to everyone" },
                    { value: "unlisted", icon: EyeOff, label: "Unlisted", desc: "Only via link" },
                    { value: "private", icon: Lock, label: "Private", desc: "Not listed anywhere" },
                  ] as const).map((v) => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => setVisibility(v.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border transition-colors ${
                        visibility === v.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-border/60 hover:border-foreground/30"
                      }`}
                    >
                      <v.icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{v.label}</span>
                      <span className={`text-[10px] ${visibility === v.value ? "opacity-70" : "text-muted-foreground"}`}>{v.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-1">
                  <label htmlFor="poll-pw" className="text-sm">Password (optional)</label>
                  <div className="relative">
                    <Input
                      id="poll-pw"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Require password to view"
                      className="bg-background placeholder:text-foreground/25 pr-10"
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
                </div>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-border/40">
                  <span className="text-sm">Allow anonymous voting</span>
                  <input type="checkbox" checked={allowAnonymousVotes}
                    onChange={(e) => setAllowAnonymousVotes(e.target.checked)}
                    className="rounded h-4 w-4" />
                </label>
              </div>

              {/* Advanced settings */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                Advanced
              </button>

              {showAdvanced && (
                <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="poll-deadline" className="text-sm">Deadline</label>
                    <Input
                      id="poll-deadline"
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">Show winner</span>
                    <input type="checkbox" checked={showWinner}
                      onChange={(e) => setShowWinner(e.target.checked)}
                      className="rounded h-4 w-4" />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">Allow remix</span>
                    <input type="checkbox" checked={allowRemix}
                      onChange={(e) => setAllowRemix(e.target.checked)}
                      className="rounded h-4 w-4" />
                  </label>
                </div>
              )}

              {/* Publish button inline */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !canPublish}
                size="lg"
                className="w-full h-12 text-base"
              >
                {submitting ? "Publishing..." : remixFrom ? "Publish remix" : "Publish poll"}
              </Button>
              {!canPublish && (
                <p className="text-xs text-destructive text-center">
                  Go back and fill at least 2 option labels.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation — sticky so it's always visible */}
      <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-lg">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => goToStep(step - 1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button
              onClick={() => goToStep(step + 1)}
              disabled={step === 0 ? !canNextFromStep0 : false}
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canPublish}
              size="lg"
            >
              {submitting ? "Publishing..." : remixFrom ? "Publish remix" : "Publish poll"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
