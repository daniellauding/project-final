/**
 * Converts a regular URL to an embeddable URL.
 * Handles Figma, YouTube, CodePen, Loom, Google Slides etc.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return "";

  try {
    const u = new URL(url);

    // Figma — must use embed wrapper
    if (u.hostname === "www.figma.com" || u.hostname === "figma.com") {
      // Already an embed URL
      if (u.pathname.startsWith("/embed")) return url;
      // Convert any figma link to embed format
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    // YouTube
    if (u.hostname === "www.youtube.com" && u.pathname === "/watch") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }

    // Loom
    if (u.hostname === "www.loom.com" && u.pathname.startsWith("/share/")) {
      return url.replace("/share/", "/embed/");
    }

    // CodePen — /pen/ to /embed/
    if (u.hostname === "codepen.io" && u.pathname.includes("/pen/")) {
      return url.replace("/pen/", "/embed/");
    }

    // Google Slides
    if (u.hostname === "docs.google.com" && u.pathname.includes("/presentation/")) {
      if (!u.pathname.includes("/embed")) {
        return url.replace("/pub", "/embed");
      }
    }

    // Everything else — return as-is (works for Lovable, Vercel deploys, etc.)
    return url;
  } catch {
    return url;
  }
}
