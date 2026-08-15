"use client";

import { useState } from "react";

export type PreviewEvent = {
  label: string;
  type: "lecture" | "oh" | "holiday";
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const chipClass: Record<PreviewEvent["type"], string> = {
  lecture:
    "bg-penn-blue-50 text-penn-blue-700 dark:bg-penn-blue-900/40 dark:text-penn-blue-100",
  oh: "bg-penn-red-50 text-penn-red-700 dark:bg-penn-red-900/40 dark:text-penn-red-200",
  holiday:
    "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addDays(dateIso: string, days: number): string {
  const d = new Date(dateIso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayOf(dateIso: string): number {
  return new Date(dateIso + "T00:00:00Z").getUTCDay();
}

// Sunday that starts the week containing dateIso.
function sundayOf(dateIso: string): string {
  return addDays(dateIso, -weekdayOf(dateIso));
}

function shortDate(dateIso: string): string {
  const [, m, d] = dateIso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}`;
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000
  );
}

export default function CalendarPreview({
  months,
  events,
  weekOneMonday,
  lastDay,
}: {
  months: string[]; // "YYYY-MM", ascending
  events: Record<string, PreviewEvent[]>; // keyed by "YYYY-MM-DD"
  weekOneMonday: string;
  lastDay: string;
}) {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // All week-start Sundays covering the semester.
  const weeks: string[] = [];
  for (
    let sunday = sundayOf(weekOneMonday);
    sunday <= lastDay;
    sunday = addDays(sunday, 7)
  ) {
    weeks.push(sunday);
  }

  const currentMonthKey = todayIso.slice(0, 7);
  const currentSunday = sundayOf(todayIso);
  const initialWeek = weeks.indexOf(currentSunday);

  const [view, setView] = useState<"week" | "month">("week");
  const [monthIndex, setMonthIndex] = useState(
    Math.max(0, months.indexOf(currentMonthKey))
  );
  const [weekIndex, setWeekIndex] = useState(
    initialWeek === -1 ? (todayIso < weekOneMonday ? 0 : weeks.length - 1) : initialWeek
  );

  const navButton =
    "rounded-md border border-neutral-200 px-2.5 py-1 text-sm text-neutral-700 transition-colors enabled:hover:border-penn-red-300 enabled:hover:text-penn-red-600 disabled:opacity-40 dark:border-neutral-800 dark:text-neutral-300 dark:enabled:hover:border-penn-red-500/40 dark:enabled:hover:text-penn-red-400";

  const toggleButton = (active: boolean) =>
    "rounded-md px-3 py-1 text-sm font-medium transition-colors " +
    (active
      ? "bg-penn-blue-600 text-white dark:bg-penn-blue-500"
      : "text-neutral-600 hover:text-penn-red-600 dark:text-neutral-400 dark:hover:text-penn-red-400");

  // Header pieces per view.
  let heading: string;
  let subheading: string | null = null;
  let canPrev: boolean;
  let canNext: boolean;
  if (view === "month") {
    const [year, month] = months[monthIndex].split("-").map(Number);
    heading = `${MONTH_NAMES[month - 1]} ${year}`;
    canPrev = monthIndex > 0;
    canNext = monthIndex < months.length - 1;
  } else {
    const start = weeks[weekIndex];
    const end = addDays(start, 6);
    heading = `${shortDate(start)} to ${shortDate(end)}, ${start.slice(0, 4)}`;
    const monday = addDays(start, 1);
    const courseWeek = Math.floor(daysBetween(weekOneMonday, monday) / 7) + 1;
    if (courseWeek >= 1 && monday <= lastDay) {
      subheading = `Week ${courseWeek}`;
    }
    canPrev = weekIndex > 0;
    canNext = weekIndex < weeks.length - 1;
  }

  const goPrev = () =>
    view === "month"
      ? setMonthIndex((i) => Math.max(0, i - 1))
      : setWeekIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    view === "month"
      ? setMonthIndex((i) => Math.min(months.length - 1, i + 1))
      : setWeekIndex((i) => Math.min(weeks.length - 1, i + 1));

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {heading}
          </h3>
          {subheading && (
            <span className="text-xs font-medium text-penn-red-600 dark:text-penn-red-400">
              {subheading}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Calendar view"
            className="flex rounded-md border border-neutral-200 p-0.5 dark:border-neutral-800"
          >
            <button
              type="button"
              onClick={() => setView("week")}
              aria-pressed={view === "week"}
              className={toggleButton(view === "week")}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setView("month")}
              aria-pressed={view === "month"}
              className={toggleButton(view === "month")}
            >
              Month
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label={view === "month" ? "Previous month" : "Previous week"}
              className={navButton}
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label={view === "month" ? "Next month" : "Next week"}
              className={navButton}
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {view === "month" ? (
        <MonthGrid monthKey={months[monthIndex]} events={events} todayIso={todayIso} />
      ) : (
        <WeekGrid startSunday={weeks[weekIndex]} events={events} todayIso={todayIso} />
      )}
    </div>
  );
}

function MonthGrid({
  monthKey,
  events,
  todayIso,
}: {
  monthKey: string;
  events: Record<string, PreviewEvent[]>;
  todayIso: string;
}) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      <div className="grid grid-cols-7 border-b border-neutral-200 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dateIso = day ? `${monthKey}-${pad(day)}` : null;
          const dayEvents = dateIso ? (events[dateIso] ?? []) : [];
          const isToday = dateIso === todayIso;
          return (
            <div
              key={i}
              className={
                "min-h-[76px] border-b border-r border-neutral-100 p-1.5 text-left align-top dark:border-neutral-800/60 " +
                ((i + 1) % 7 === 0 ? "border-r-0 " : "") +
                (day === null ? "bg-neutral-50/60 dark:bg-neutral-900/40" : "")
              }
            >
              {day !== null && (
                <>
                  <span
                    className={
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs " +
                      (isToday
                        ? "bg-penn-red-600 font-semibold text-white"
                        : "text-neutral-500 dark:text-neutral-400")
                    }
                  >
                    {day}
                  </span>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayEvents.map((ev, j) => (
                      <span
                        key={j}
                        title={ev.label}
                        className={
                          "truncate rounded px-1 py-0.5 text-[10px] leading-tight " +
                          chipClass[ev.type]
                        }
                      >
                        {ev.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function WeekGrid({
  startSunday,
  events,
  todayIso,
}: {
  startSunday: string;
  events: Record<string, PreviewEvent[]>;
  todayIso: string;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(startSunday, i));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7">
      {days.map((dateIso, i) => {
        const dayEvents = events[dateIso] ?? [];
        const isToday = dateIso === todayIso;
        const dayNum = Number(dateIso.slice(8, 10));
        return (
          <div
            key={dateIso}
            className={
              "border-b border-neutral-100 p-2 last:border-b-0 sm:min-h-[140px] sm:border-b-0 sm:border-r sm:last:border-r-0 dark:border-neutral-800/60 " +
              (isToday ? "bg-penn-red-50/40 dark:bg-penn-red-900/10" : "")
            }
          >
            <div className="flex items-center gap-1.5 sm:flex-col sm:items-start sm:gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {DAY_HEADERS[i]}
              </span>
              <span
                className={
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs " +
                  (isToday
                    ? "bg-penn-red-600 font-semibold text-white"
                    : "text-neutral-500 dark:text-neutral-400")
                }
              >
                {dayNum}
              </span>
            </div>
            <div className="mt-1.5 flex flex-col gap-1">
              {dayEvents.map((ev, j) => (
                <span
                  key={j}
                  className={
                    "rounded px-1.5 py-1 text-xs leading-snug " + chipClass[ev.type]
                  }
                >
                  {ev.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
