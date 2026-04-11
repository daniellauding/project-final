import { useState, useRef, useCallback, useEffect } from "react";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Check, X, MapPin } from "lucide-react";

interface Pin {
  _id: string;
  text: string;
  xPercent: number;
  yPercent: number;
  optionIndex: number;
  username: string;
  user: string | null;
  resolved: boolean;
  createdAt: string;
}

interface PinDropLayerProps {
  pollId: string;
  optionIndex: number;
  enabled: boolean;
  onToggle: () => void;
}

export default function PinDropLayer({ pollId, optionIndex, enabled, onToggle }: PinDropLayerProps) {
  const { user } = useAuth();
  const [pins, setPins] = useState<Pin[]>([]);
  const [placing, setPlacing] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState("");
  const [anonName, setAnonName] = useState(() => localStorage.getItem("pejla-pin-name") || "");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingPlace, setPendingPlace] = useState<{ x: number; y: number } | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchPins = useCallback(async () => {
    try {
      const data = await pollApi.getPins(pollId, optionIndex);
      if (Array.isArray(data)) setPins(data);
    } catch {}
  }, [pollId, optionIndex]);

  useEffect(() => { fetchPins(); }, [fetchPins]);

  // Focus input when placing
  useEffect(() => {
    if (placing && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [placing]);

  const handleLayerClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    // Don't place if clicking an existing pin
    if ((e.target as HTMLElement).closest("[data-pin]")) return;

    const rect = layerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // If anonymous and no name set, prompt for name first
    if (!user && !anonName) {
      setPendingPlace({ x, y });
      setShowNamePrompt(true);
      return;
    }

    setPlacing({ x, y });
    setDraftText("");
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
    if (!draftText.trim() || !placing) return;

    await pollApi.addPin(pollId, {
      text: draftText.trim(),
      xPercent: placing.x,
      yPercent: placing.y,
      optionIndex,
      username: user?.username || anonName || "Ralph Wiggum",
    });

    setPlacing(null);
    setDraftText("");
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
  };

  const visiblePins = showResolved ? pins : pins.filter(p => !p.resolved);
  const resolvedCount = pins.filter(p => p.resolved).length;

  return (
    <>
      {/* Pin layer overlay */}
      <div
        ref={layerRef}
        className={`absolute inset-0 z-20 ${enabled ? "cursor-crosshair" : "pointer-events-none"}`}
        onClick={handleLayerClick}
      >
        {/* Existing pins */}
        {visiblePins.map((pin, i) => (
          <button
            key={pin._id}
            data-pin
            className={`absolute -translate-x-1/2 -translate-y-full group transition-transform hover:scale-110 ${
              pin.resolved ? "opacity-50" : ""
            }`}
            style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
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
                : "bg-primary border-primary text-primary-foreground"
            }`}>
              {i + 1}
              {/* Tail */}
              <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent ${
                pin.resolved ? "border-t-green-500" : "border-t-primary"
              }`} />
            </div>

            {/* Hover tooltip */}
            {activePin !== pin._id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-background border border-border shadow-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-[200px] truncate">
                <span className="font-medium">{pin.username}:</span> {pin.text}
              </div>
            )}
          </button>
        ))}

        {/* Active pin detail popover */}
        {activePin && (() => {
          const pin = pins.find(p => p._id === activePin);
          if (!pin) return null;
          return (
            <div
              className="absolute z-30 w-64 bg-background border border-border rounded-lg shadow-xl"
              style={{
                left: `${Math.min(Math.max(pin.xPercent, 15), 85)}%`,
                top: `${pin.yPercent}%`,
                transform: "translate(-50%, 8px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                      {pin.username[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-xs font-medium">{pin.username}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(pin.createdAt).toLocaleDateString("sv")}
                  </span>
                </div>
                <p className="text-sm break-words">{pin.text}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {user && (
                    <>
                      <button
                        onClick={() => handleResolve(pin._id, !pin.resolved)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                          pin.resolved
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-muted hover:bg-accent text-muted-foreground"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                        {pin.resolved ? "Resolved" : "Resolve"}
                      </button>
                      {(pin.user === user.userId) && (
                        <button
                          onClick={() => handleDelete(pin._id)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                        >
                          <X className="h-3 w-3" />
                          Delete
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setActivePin(null)}
                    className="ml-auto px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Placing new pin */}
        {placing && (
          <div
            className="absolute z-30 w-64"
            style={{
              left: `${Math.min(Math.max(placing.x, 15), 85)}%`,
              top: `${placing.y}%`,
              transform: "translate(-50%, 8px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin preview */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <div className="w-7 h-7 rounded-full bg-primary border-2 border-primary text-primary-foreground flex items-center justify-center text-xs font-bold animate-bounce">
                <MapPin className="h-3.5 w-3.5" />
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
                placeholder="Leave feedback..."
                className="w-full border rounded px-2 py-1.5 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitPin();
                  if (e.key === "Escape") cancelPlace();
                }}
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">⌘+Enter to send</span>
                <div className="flex gap-1">
                  <button onClick={cancelPlace} className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPin}
                    disabled={!draftText.trim()}
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

      {/* Floating controls */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5">
        {pins.length > 0 && resolvedCount > 0 && (
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-2 py-1 rounded-full text-[10px] border transition ${
              showResolved ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-background/80 border-border text-muted-foreground"
            } backdrop-blur-sm`}
          >
            {showResolved ? `Hide ${resolvedCount} resolved` : `Show ${resolvedCount} resolved`}
          </button>
        )}
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition backdrop-blur-sm ${
            enabled
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-background/80 text-foreground border-border hover:bg-secondary"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          {enabled ? "Pinning..." : `Pins${pins.length ? ` (${pins.length})` : ""}`}
        </button>
      </div>
    </>
  );
}
