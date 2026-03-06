import { describe, it, expect } from "vitest";
import { toEmbedUrl, isEmbeddable } from "./embedUrl";

describe("toEmbedUrl", () => {
  it("returns null for Figma URLs (CSP blocks iframe embedding)", () => {
    expect(toEmbedUrl("https://www.figma.com/design/abc123/MyDesign")).toBeNull();
    expect(toEmbedUrl("https://www.figma.com/proto/abc123/MyProto")).toBeNull();
  });

  it("converts YouTube watch URLs to embed", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcB")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcB"
    );
  });

  it("converts youtu.be short URLs to embed", () => {
    expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcB")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcB"
    );
  });

  it("converts Loom share URLs to embed", () => {
    expect(toEmbedUrl("https://www.loom.com/share/abc123")).toBe(
      "https://www.loom.com/embed/abc123"
    );
  });

  it("converts CodePen pen URLs to embed", () => {
    const result = toEmbedUrl("https://codepen.io/user/pen/abc123");
    expect(result).toContain("/embed/");
    expect(result).not.toContain("/pen/");
  });

  it("converts Vimeo URLs to player embed", () => {
    expect(toEmbedUrl("https://vimeo.com/123456")).toBe(
      "https://player.vimeo.com/video/123456"
    );
  });

  it("returns null for non-embeddable domains like google.com", () => {
    expect(toEmbedUrl("https://google.com")).toBeNull();
  });

  it("returns null for random websites", () => {
    expect(toEmbedUrl("https://example.com/page")).toBeNull();
  });

  it("returns the URL for known embeddable deploy platforms", () => {
    expect(toEmbedUrl("https://my-app.vercel.app")).toBe("https://my-app.vercel.app");
    expect(toEmbedUrl("https://my-app.netlify.app")).toBe("https://my-app.netlify.app");
  });

  it("returns null for empty string", () => {
    expect(toEmbedUrl("")).toBeNull();
  });

  it("returns null for invalid URLs", () => {
    expect(toEmbedUrl("not-a-url")).toBeNull();
  });
});

describe("isEmbeddable", () => {
  it("returns true for known embeddable domains", () => {
    expect(isEmbeddable("https://www.youtube.com/watch?v=123")).toBe(true);
    expect(isEmbeddable("https://codepen.io/pen/123")).toBe(true);
    expect(isEmbeddable("https://my-app.vercel.app")).toBe(true);
  });

  it("returns false for non-embeddable domains", () => {
    expect(isEmbeddable("https://google.com")).toBe(false);
    expect(isEmbeddable("https://facebook.com")).toBe(false);
    expect(isEmbeddable("https://twitter.com")).toBe(false);
  });

  it("returns false for invalid URLs", () => {
    expect(isEmbeddable("not-a-url")).toBe(false);
    expect(isEmbeddable("")).toBe(false);
  });
});
