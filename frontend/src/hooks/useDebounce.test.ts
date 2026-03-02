import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update value before delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe("hello");

    vi.useRealTimers();
  });

  it("updates value after delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe("world");

    vi.useRealTimers();
  });

  it("resets timer on rapid changes — only last value wins", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    // Type fast: a -> ab -> abc
    rerender({ value: "ab" });
    act(() => { vi.advanceTimersByTime(200); });
    rerender({ value: "abc" });
    act(() => { vi.advanceTimersByTime(200); });

    // Only 200ms since "abc" — still old
    expect(result.current).toBe("a");

    // Now 300ms since "abc"
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe("abc");

    vi.useRealTimers();
  });
});
