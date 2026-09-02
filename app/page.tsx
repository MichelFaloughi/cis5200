import ScheduleTable from "@/components/ScheduleTable";
import { getConfig, getCurrentWeek } from "@/lib/content";

// Re-render hourly so the "current week" highlight advances without a deploy.
export const revalidate = 3600;

export default function HomePage() {
  const config = getConfig();
  const currentWeek = getCurrentWeek();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-penn-red-600 dark:text-penn-red-400">
          University of Pennsylvania · {config.semester.label}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-penn-blue-600 sm:text-4xl dark:text-white">
          {config.course.code}:{" "}
          <span className="text-penn-blue-600 dark:text-white">
            {config.course.title}
          </span>
        </h1>
        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Instructor:
          </span>{" "}
          {config.instructor.name} ·{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Lecture:
          </span>{" "}
          {config.semester.meetingTime} · {config.semester.location}
        </p>
      </header>

      <section
        aria-labelledby="schedule-heading"
        className="mt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="schedule-heading"
            className="text-2xl font-semibold tracking-tight text-penn-blue-600 dark:text-white"
          >
            Weekly Schedule
          </h2>
          {currentWeek !== null && (
            <a
              href={`#week-${currentWeek}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-penn-red-300 hover:text-penn-red-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-penn-red-500/40 dark:hover:text-penn-red-400"
            >
              Skip to current week
            </a>
          )}
        </div>

        <div className="mt-4">
          <ScheduleTable currentWeek={currentWeek} />
        </div>

        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Semester runs {formatRange(config.semester.weekOneMonday, config.semester.lastDay)}.
          Topics are tentative and may change.
        </p>
      </section>
    </div>
  );
}

function formatRange(startIso: string, endIso: string) {
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(startIso)} – ${fmt(endIso)}`;
}
