import type { Announcement } from "@/lib/content";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <article className="group relative rounded-lg border border-neutral-200 bg-white p-5 transition-all hover:border-penn-red-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-penn-red-500/40">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold text-penn-blue-600 dark:text-white">
          {announcement.title}
        </h3>
        {announcement.pinned && (
          <span className="inline-flex items-center rounded-full bg-penn-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-penn-red-700 dark:bg-penn-red-950 dark:text-penn-red-300">
            Pinned
          </span>
        )}
      </div>
      <time
        dateTime={announcement.date}
        className="mt-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
      >
        {formatDate(announcement.date)}
      </time>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {announcement.body}
      </p>
    </article>
  );
}
