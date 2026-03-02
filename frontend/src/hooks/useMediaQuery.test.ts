import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

// jsdom doesn't have matchMedia — provide a mock
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

describe("useMediaQuery", () => {
  it("returns initial match state", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("returns true when query matches", () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("responds to media query changes", () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;

    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((_: string, cb: any) => { listener = cb; }),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);

    act(() => {
      if (listener) listener({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);
  });

  it("cleans up listener on unmount", () => {
    const removeFn = vi.fn();
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeFn,
    }));

    const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    unmount();

    expect(removeFn).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
