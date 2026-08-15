export type PlaylistVideo = {
  id: string;
  title: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function playlistIdFromUrl(url: string): string | null {
  const match = url.match(/[?&]list=([\w-]+)/);
  return match ? match[1] : null;
}

// Reads the playlist's public RSS feed at build time; no API key needed.
// Returns [] on any failure so the page still builds if YouTube is down.
// The feed only includes public videos and caps at 15 entries.
export async function getPlaylistVideos(
  playlistId: string
): Promise<PlaylistVideo[]> {
  try {
    // Revalidate hourly so newly published videos appear without a redeploy.
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    return entries.flatMap((entry) => {
      const id = entry.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
      return id && title ? [{ id, title: decodeEntities(title) }] : [];
    });
  } catch {
    return [];
  }
}
