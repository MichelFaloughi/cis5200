import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";
import { getConfig } from "@/lib/content";
import { getPlaylistVideos, playlistIdFromUrl } from "@/lib/youtube";

export const metadata = { title: "TA Resources" };

export default async function TaResourcesPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "resources",
    "ta-resources"
  );
  const playlistUrl = getConfig().links.recitationPlaylist;
  const playlistId = playlistIdFromUrl(playlistUrl);
  const videos = playlistId ? await getPlaylistVideos(playlistId) : [];

  return (
    <>
      <PageHeader eyebrow="Resources" title={title} description={description} />

      <section aria-labelledby="videos-heading" className="mb-10">
        <h2
          id="videos-heading"
          className="text-xl font-semibold tracking-tight text-penn-blue-600 dark:text-white"
        >
          Recitation Solution Walkthroughs
        </h2>
        {videos.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            Video walkthroughs will appear here as they are published. In the
            meantime, the playlist lives on{" "}
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
            >
              YouTube
            </a>
            .
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}&list=${playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors hover:border-penn-red-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-penn-red-500/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  <p className="p-3 text-sm font-medium text-neutral-900 group-hover:text-penn-red-600 dark:text-neutral-100 dark:group-hover:text-penn-red-400">
                    {video.title}
                  </p>
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                View the full playlist on YouTube
              </a>
            </p>
          </>
        )}
      </section>

      <MarkdownContent html={contentHtml} />
    </>
  );
}
