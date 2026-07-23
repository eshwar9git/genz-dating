import { NextResponse } from "next/server";

/** Proxy TikTok oEmbed so the WebView/browser isn't blocked by CORS. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "TikTok preview unavailable" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "TikTok preview failed" },
      { status: 502 }
    );
  }
}
