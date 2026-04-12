import { useState, useEffect } from "react";
import { Heart, Coffee, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PRESET_AMOUNTS = [5, 10, 25];

export default function Support() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("coffee") === "success") {
      toast.success("Thank you for supporting Pejla!", {
        description: "Your contribution helps keep Pejla free for everyone.",
        icon: <Heart className="h-4 w-4 text-red-500" />,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("coffee");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
  };

  const handleSubmit = async () => {
    if (currentAmount < 1) {
      toast.error("Please select or enter an amount of at least $1.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentAmount,
          name: name || undefined,
          email: email || undefined,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-2">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Support Pejla
          </h1>
          <p className="text-muted-foreground">
            Help keep Pejla free and open for designers everywhere.
          </p>
        </div>

        {/* Amount Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Choose an amount
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                  !isCustom && selectedAmount === amount
                    ? "border-primary ring-2 ring-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-2xl font-bold text-foreground">
                  ${amount}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {amount === 5
                    ? "A coffee"
                    : amount === 10
                      ? "A nice lunch"
                      : "A big boost"}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <Input
              type="number"
              min={1}
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              onFocus={() => setIsCustom(true)}
              className={`pl-7 ${
                isCustom && customAmount
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Optional details
          </label>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Leave a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={loading || currentAmount < 1}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {loading ? (
            "Redirecting..."
          ) : (
            <>
              Support with ${currentAmount}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              What you get
            </span>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Free Tier */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              Free — forever
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Unlimited polls",
                "Anonymous voting",
                "Comments",
                "Pin feedback",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Supporter Tier */}
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-5 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Supporter
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Priority support",
                "Early access to Chrome Extension",
                "Early access to Figma Plugin",
                "Your name in credits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          Payments are processed securely via Stripe. No account required.
        </p>
      </div>
    </div>
  );
}
