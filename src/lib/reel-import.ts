import type { ReelSource } from "@/lib/types";

const INSTAGRAM_RE =
  /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(reel|p|tv)\//i;
const TIKTOK_RE =
  /^(https?:\/\/)?((www|vm|vt)\.)?tiktok\.com\//i;

export function detectReelPlatform(url: string): ReelSource | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (INSTAGRAM_RE.test(trimmed) || trimmed.includes("instagram.com/reel")) {
    return "instagram";
  }
  if (TIKTOK_RE.test(trimmed)) return "tiktok";
  return null;
}

export function normalizeExternalUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export type ExternalReelPreview = {
  source: ReelSource;
  externalUrl: string;
  caption: string;
  posterUrl: string;
};

/** Best-effort preview for Instagram / TikTok links (demo-friendly). */
export async function fetchExternalReelPreview(
  rawUrl: string,
  fallbackPoster: string
): Promise<ExternalReelPreview | { error: string }> {
  const externalUrl = normalizeExternalUrl(rawUrl);
  const source = detectReelPlatform(externalUrl);
  if (!source || (source !== "instagram" && source !== "tiktok")) {
    return {
      error: "Paste a public Instagram Reel or TikTok video link.",
    };
  }

  if (source === "tiktok") {
    try {
      const res = await fetch(
        `/api/oembed/tiktok?url=${encodeURIComponent(externalUrl)}`
      );
      if (res.ok) {
        const data = (await res.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        return {
          source,
          externalUrl,
          caption:
            data.title?.slice(0, 140) ||
            `Imported from TikTok${data.author_name ? ` · @${data.author_name}` : ""}`,
          posterUrl: data.thumbnail_url || fallbackPoster,
        };
      }
    } catch {
      // fall through to generic preview
    }
  }

  // Instagram oEmbed needs a Meta app token — use a clean local preview instead
  const label = source === "instagram" ? "Instagram" : "TikTok";
  return {
    source,
    externalUrl,
    caption: `Imported from ${label}`,
    posterUrl: fallbackPoster,
  };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
