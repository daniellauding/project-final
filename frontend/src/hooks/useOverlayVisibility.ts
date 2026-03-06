import { useState, useEffect, useCallback, useRef } from "react";

export function useOverlayVisibility(keepVisible = false, timeout = 3000) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    setVisible(true);
    clearTimeout(timer.current);
    if (!keepVisible) {
      timer.current = setTimeout(() => setVisible(false), timeout);
    }
  }, [keepVisible, timeout]);

  useEffect(() => {
    if (keepVisible) {
      setVisible(true);
      clearTimeout(timer.current);
      return;
    }
    resetTimer();
    const events = ["mousemove", "mousedown", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer));
    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [keepVisible, resetTimer]);

  return visible;
}
