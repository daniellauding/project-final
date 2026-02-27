import { useState, useEffect } from "react";

/**
 * Delays updating a value until after `delay` ms of inactivity.
 * Useful for search inputs, auto-save, or any rapid-fire user input.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
