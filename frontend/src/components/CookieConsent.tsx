import { useState } from "react";
import { hasConsented, acceptCookies, declineCookies } from "../lib/analytics";

const CookieConsent = () => {
  const [visible, setVisible] = useState(!hasConsented());

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-card border border-border/60 rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom duration-300">
      <p className="text-sm text-muted-foreground mb-3">
        We use cookies to understand how you use Pejla and improve the experience. No personal data is sold.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => { acceptCookies(); setVisible(false); }}
          className="flex-1 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
        >
          Accept
        </button>
        <button
          onClick={() => { declineCookies(); setVisible(false); }}
          className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-accent transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
