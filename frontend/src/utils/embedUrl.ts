/**
 * Known domains that allow iframe embedding.
 * Other domains (like google.com) block iframes via X-Frame-Options / CSP.
 */
const EMBEDDABLE_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "loom.com",
  "www.loom.com",
  "codepen.io",
  "codesandbox.io",
  "docs.google.com",
  "slides.google.com",
  "open.spotify.com",
  "soundcloud.com",
  "vimeo.com",
  "player.vimeo.com",
  "stackblitz.com",
  "replit.com",
  "lovable.dev",
  "lovable.app",
  "v0.dev",
  "bolt.new",
  "val.town",
  "webcontainer.io",
  "csb.app",
  "githubpreview.dev",
  "vercel.app",
  "netlify.app",
  "github.io",
  "gitlab.io",
  "surge.sh",
  "render.com",
  "railway.app",
  "fly.dev",
  "pages.dev",
  "workers.dev",
  "deno.dev",
  "figma.com",
  "www.figma.com",
];

/**
 * Check if a URL's domain is known to allow embedding.
 */
export function isEmbeddable(url: string): boolean {
  try {
    const u = new URL(url);
    return EMBEDDABLE_DOMAINS.some(
      (d) => u.hostname === d || u.hostname.endsWith("." + d)
    );
  } catch {
    return false;
  }
}

/**
 * Converts a regular URL to an embeddable URL.
 * Returns null if the domain is not known to support embedding.
 */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);

    // YouTube
    if (u.hostname === "www.youtube.com" && u.pathname === "/watch") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname === "www.youtube.com" && u.pathname.startsWith("/embed/")) {
      return url;
    }

    // Vimeo
    if (u.hostname === "vimeo.com") {
      const id = u.pathname.split("/").pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    // Loom
    if (u.hostname === "www.loom.com" && u.pathname.startsWith("/share/")) {
      return url.replace("/share/", "/embed/");
    }

    // CodePen
    if (u.hostname === "codepen.io" && u.pathname.includes("/pen/")) {
      return url.replace("/pen/", "/embed/");
    }

    // CodeSandbox
    if (u.hostname === "codesandbox.io" && u.pathname.startsWith("/s/")) {
      return url.replace("/s/", "/embed/");
    }

    // Google Slides
    if (u.hostname === "docs.google.com" && u.pathname.includes("/presentation/")) {
      if (!u.pathname.includes("/embed")) {
        return url.replace("/pub", "/embed");
      }
    }

    // Spotify
    if (u.hostname === "open.spotify.com") {
      return url.replace("open.spotify.com", "open.spotify.com/embed");
    }

    // Figma (proto, design, board) — use official embed endpoint
    if (u.hostname === "www.figma.com" || u.hostname === "figma.com") {
      if (u.pathname === "/embed") return url;
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    // Known embeddable domains — return as-is
    if (isEmbeddable(url)) return url;

    // Unknown domain — not safe to iframe
    return null;
  } catch {
    return null;
  }
}
