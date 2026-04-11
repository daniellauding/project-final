import { useState, useRef, useCallback, useEffect } from "react";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Check, X, MapPin, Send, Image as ImageIcon, Smile } from "lucide-react";

interface Reply {
  _id: string;
  text: string;
  username: string;
  user: string | null;
  imageUrl?: string;
  emoji?: string;
  createdAt: string;
}

interface Pin {
  _id: string;
  text: string;
  xPercent: number;
  yPercent: number;
  optionIndex: number;
  username: string;
  user: string | null;
  imageUrl?: string;
  emoji?: string;
  resolved: boolean;
  replies: Reply[];
  createdAt: string;
}

interface PinDropLayerProps {
  pollId: string;
  optionIndex: number;
  enabled: boolean;
  onToggle: () => void;
}

const QUICK_EMOJIS = ["👍", "👎", "❤️", "🔥", "💡", "⚠️", "✅", "❌"];

export default function PinDropLayer({ pollId, optionIndex, enabled, onToggle }: PinDropLayerProps) {
  const { user } = useAuth();
  const [pins, setPins] = useState<Pin[]>([]);
  const [placing, setPlacing] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState("");
  const [draftEmoji, setDraftEmoji] = useState("");
  const [anonName, setAnonName] = useState(() => localStorage.getItem("pejla-pin-name") || "");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingPlace, setPendingPlace] = useState<{ x: number; y: number } | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyEmojiPicker, setReplyEmojiPicker] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const fetchPins = useCallback(async () => {
    try {
      const data = await pollApi.getPins(pollId, optionIndex);
      if (Array.isArray(data)) setPins(data);
    } catch {}
  }, [pollId, optionIndex]);

  useEffect(() => { fetchPins(); }, [fetchPins]);

  useEffect(() => {
    if (placing && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [placing]);

  // Scroll to bottom of thread when new replies come in
  useEffect(() => {
    if (activePin && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activePin, pins]);

  const handleLayerClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    if ((e.target as HTMLElement).closest("[data-pin]")) return;
    if ((e.target as HTMLElement).closest("[data-popover]")) return;

    const rect = layerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!user && !anonName) {
      setPendingPlace({ x, y });
      setShowNamePrompt(true);
      return;
    }

    setPlacing({ x, y });
    setDraftText("");
    setDraftEmoji("");
    setActivePin(null);
  };

  const handleNameSave = () => {
    const name = anonName.trim() || "Ralph Wiggum";
    setAnonName(name);
    localStorage.setItem("pejla-pin-name", name);
    setShowNamePrompt(false);
    if (pendingPlace) {
      setPlacing(pendingPlace);
      setPendingPlace(null);
      setDraftText("");
    }
  };

  const handleSubmitPin = async () => {
    if (!draftText.trim() && !draftEmoji) return;
    if (!placing) return;

    await pollApi.addPin(pollId, {
      text: draftText.trim() || draftEmoji,
      xPercent: placing.x,
      yPercent: placing.y,
      optionIndex,
      username: user?.username || anonName || "Ralph Wiggum",
      emoji: draftEmoji,
    });

    setPlacing(null);
    setDraftText("");
    setDraftEmoji("");
    fetchPins();
  };

  const handleReply = async (pinId: string) => {
    if (!replyText.trim()) return;

    await pollApi.addPinReply(pinId, {
      text: replyText.trim(),
      username: user?.username || anonName || "Ralph Wiggum",
    });

    setReplyText("");
    fetchPins();
  };

  const handleResolve = async (pinId: string, resolved: boolean) => {
    await pollApi.updatePin(pinId, { resolved });
    fetchPins();
  };

  const handleDelete = async (pinId: string) => {
    await pollApi.deletePin(pinId);
    setActivePin(null);
    fetchPins();
  };

  const cancelPlace = () => {
    setPlacing(null);
    setDraftText("");
    setDraftEmoji("");
  };

  // Render @mentions as highlighted spans
  const renderText = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-primary font-medium">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const visiblePins = showResolved ? pins : pins.filter(p => !p.resolved);
  const resolvedCount = pins.filter(p => p.resolved).length;
  // Show pins when enabled OR when there are pins to show (view mode shows markers)
  const showPins = enabled || pins.length > 0;

  return (
    <>
      {/* Pin layer overlay */}
      <div
        ref={layerRef}
        className={`absolute inset-0 z-20 ${enabled ? "cursor-crosshair" : ""}`}
        style={{ pointerEvents: enabled ? "auto" : "none" }}
        onClick={handleLayerClick}
      >
        {/* Existing pins — always visible when there are pins */}
        {showPins && visiblePins.map((pin, i) => (
          <button
            key={pin._id}
            data-pin
            className={`absolute -translate-x-1/2 -translate-y-full group transition-transform hover:scale-110 ${
              pin.resolved ? "opacity-40" : ""
            }`}
            style={{
              left: `${pin.xPercent}%`,
              top: `${pin.yPercent}%`,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActivePin(activePin === pin._id ? null : pin._id);
              setPlacing(null);
            }}
          >
            {/* Pin marker */}
            <div className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 shadow-lg text-xs font-bold ${
              pin.resolved
                ? "bg-green-500 border-green-600 text-white"
                : pin.emoji
                  ? "bg-background border-border"
                  : "bg-primary border-primary text-primary-foreground"
            }`}>
              {pin.emoji || (i + 1)}
              {pin.replies.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                  {pin.replies.length}
                </span>
              )}
              {/* Tail */}
              <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent ${
                pin.resolved ? "border-t-green-500" : pin.emoji ? "border-t-border" : "border-t-primary"
              }`} />
            </div>

            {/* Hover tooltip */}
            {activePin !== pin._id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-background border border-border shadow-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-[200px] truncate">
                <span className="font-medium">{pin.username}:</span> {pin.text}
                {pin.replies.length > 0 && (
                  <span className="text-muted-foreground"> · {pin.replies.length} {pin.replies.length === 1 ? "reply" : "replies"}</span>
                )}
              </div>
            )}
          </button>
        ))}

        {/* Active pin thread popover */}
        {activePin && (() => {
          const pin = pins.find(p => p._id === activePin);
          if (!pin) return null;
          const isAuthor = user && pin.user === user.userId;
          return (
            <div
              data-popover
              className="absolute z-30 w-72 bg-background border border-border rounded-lg shadow-xl max-h-[400px] flex flex-col"
              style={{
                left: `${Math.min(Math.max(pin.xPercent, 20), 80)}%`,
                top: `${pin.yPercent}%`,
                transform: "translate(-50%, 8px)",
                pointerEvents: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                    {pin.username[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="text-xs font-medium">{pin.username}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(pin.createdAt).toLocaleDateString("sv")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {pin.resolved && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">Done</span>
                  )}
                  <button onClick={() => setActivePin(null)} className="p-0.5 rounded hover:bg-accent text-muted-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Thread content — scrollable */}
              <div className="flex-1 overflow-y-auto px-3">
                {/* Original comment */}
                <div className="py-1.5">
                  {pin.emoji && <span className="text-lg mr-1">{pin.emoji}</span>}
                  <p className="text-sm break-words">{renderText(pin.text)}</p>
                  {pin.imageUrl && (
                    <img src={pin.imageUrl} alt="" className="mt-1.5 max-h-24 rounded border cursor-pointer hover:opacity-80" />
                  )}
                </div>

                {/* Replies */}
                {pin.replies.length > 0 && (
                  <div className="border-t border-border/50 mt-1">
                    {pin.replies.map((reply) => (
                      <div key={reply._id} className="py-2 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-medium">
                            {reply.username[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-[11px] font-medium">{reply.username}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleDateString("sv")}
                          </span>
                        </div>
                        <p className="text-sm break-words ml-5.5 pl-0.5">{renderText(reply.text)}</p>
                        {reply.imageUrl && (
                          <img src={reply.imageUrl} alt="" className="mt-1 ml-6 max-h-20 rounded border" />
                        )}
                        {reply.emoji && <span className="ml-6 text-sm">{reply.emoji}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div ref={threadEndRef} />
              </div>

              {/* Actions */}
              <div className="px-3 py-2 border-t border-border/50 shrink-0 space-y-1.5">
                {/* Reply input */}
                <div className="flex items-center gap-1">
                  <div className="relative flex-1">
                    <input
                      ref={replyInputRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Reply... (use @name to mention)"
                      className="w-full border rounded-full px-3 py-1.5 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary pr-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(pin._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => setReplyEmojiPicker(!replyEmojiPicker)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Smile className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleReply(pin._id)}
                    disabled={!replyText.trim()}
                    className="p-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>

                {/* Reply emoji picker */}
                {replyEmojiPicker && (
                  <div className="flex flex-wrap gap-1 py-1">
                    {QUICK_EMOJIS.map(e => (
                      <button
                        key={e}
                        className="text-base hover:scale-125 transition-transform p-0.5"
                        onClick={() => { setReplyText(prev => prev + e); setReplyEmojiPicker(false); replyInputRef.current?.focus(); }}
                      >{e}</button>
                    ))}
                  </div>
                )}

                {/* Bottom actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleResolve(pin._id, !pin.resolved)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition ${
                      pin.resolved
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        : "bg-muted hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                    {pin.resolved ? "Done" : "Resolve"}
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => handleDelete(pin._id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                    >
                      <X className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {pin.replies.length} {pin.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Placing new pin */}
        {placing && (
          <div
            data-popover
            className="absolute z-30 w-72"
            style={{
              left: `${Math.min(Math.max(placing.x, 20), 80)}%`,
              top: `${placing.y}%`,
              transform: "translate(-50%, 8px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin preview */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <div className="w-7 h-7 rounded-full bg-primary border-2 border-primary text-primary-foreground flex items-center justify-center text-xs font-bold animate-bounce">
                {draftEmoji || <MapPin className="h-3.5 w-3.5" />}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg shadow-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                  {(user?.username || anonName || "R")[0].toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">
                  {user?.username || anonName || "Ralph Wiggum"}
                </span>
              </div>

              <textarea
                ref={inputRef}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Leave feedback... (use @name to mention)"
                className="w-full border rounded px-2 py-1.5 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitPin();
                  if (e.key === "Escape") cancelPlace();
                }}
              />

              {/* Emoji picker */}
              <div className="flex items-center gap-1 mt-1.5">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-1 rounded text-muted-foreground hover:text-foreground transition ${showEmojiPicker ? "bg-accent" : ""}`}
                >
                  <Smile className="h-3.5 w-3.5" />
                </button>
                {draftEmoji && (
                  <span className="text-sm flex items-center gap-1">
                    {draftEmoji}
                    <button onClick={() => setDraftEmoji("")} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              {showEmojiPicker && (
                <div className="flex flex-wrap gap-1 mt-1 py-1 border-t border-border/30">
                  {QUICK_EMOJIS.map(e => (
                    <button
                      key={e}
                      className={`text-base hover:scale-125 transition-transform p-1 rounded ${draftEmoji === e ? "bg-accent" : ""}`}
                      onClick={() => { setDraftEmoji(draftEmoji === e ? "" : e); setShowEmojiPicker(false); }}
                    >{e}</button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">⌘+Enter to send</span>
                <div className="flex gap-1">
                  <button onClick={cancelPlace} className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPin}
                    disabled={!draftText.trim() && !draftEmoji}
                    className="px-3 py-1 rounded text-xs bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anonymous name prompt modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowNamePrompt(false); setPendingPlace(null); }}>
          <div className="bg-background rounded-xl shadow-2xl p-6 w-80 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold">What's your name?</h3>
              <button onClick={() => { setShowNamePrompt(false); setPendingPlace(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">This will be shown on your pins.</p>
            <input
              type="text"
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              placeholder="Ralph Wiggum"
              className="w-full border rounded-lg px-3 py-2.5 text-sm bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleNameSave(); }}
            />
            <button
              onClick={handleNameSave}
              className="w-full mt-3 py-2.5 rounded-lg bg-primary/30 text-primary font-medium text-sm hover:bg-primary/40 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Floating controls — resolved filter + pin mode hint */}
      {(enabled || pins.length > 0) && (
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5" style={{ pointerEvents: "auto" }}>
          {pins.length > 0 && resolvedCount > 0 && (
            <button
              onClick={() => setShowResolved(!showResolved)}
              className={`px-2 py-1 rounded-full text-[10px] border transition ${
                showResolved ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-background/80 border-border text-muted-foreground"
              } backdrop-blur-sm`}
            >
              {showResolved ? `Hide ${resolvedCount} resolved` : `${resolvedCount} resolved`}
            </button>
          )}
          {enabled && (
            <div className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground border border-primary text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Click to pin · V to exit
            </div>
          )}
          {!enabled && pins.length > 0 && (
            <div className="px-2 py-1 rounded-full bg-background/80 border border-border text-[10px] text-muted-foreground backdrop-blur-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {pins.length} pin{pins.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </>
  );
}
