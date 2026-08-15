"use client";

import { useEffect, useRef, useState } from "react";

export type PreviewEvent = {
  label: string;
  type: "lecture" | "oh" | "holiday";
  // 24h "HH:MM" local times; events without times render as all-day.
  start?: string;
  end?: string;
  location?: string;
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

const HOUR_HEIGHT = 44; // px per hour; full day = 24 * HOUR_HEIGHT

function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function hourLabel(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

type TimedEvent = PreviewEvent & { start: string; end: string };

// Assign overlapping events to side-by-side lanes within a day column.
function layoutDay(dayEvents: TimedEvent[]) {
  const sorted = [...dayEvents].sort(
    (a, b) => minutesOf(a.start) - minutesOf(b.start)
  );
  const laneEnds: number[] = [];
  const placed = sorted.map((ev) => {
    const start = minutesOf(ev.start);
    const end = Math.max(minutesOf(ev.end), start + 20);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    return { ev, start, end, lane };
  });
  const lanes = Math.max(1, laneEnds.length);
  return { placed, lanes };
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
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Open scrolled to 9am rather than midnight.
    if (scrollRef.current) scrollRef.current.scrollTop = 9 * HOUR_HEIGHT;
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => addDays(startSunday, i));
  const hasAllDay = days.some((d) =>
    (events[d] ?? []).some((ev) => !ev.start || !ev.end)
  );
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Day-of-week header */}
        <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-neutral-200 dark:border-neutral-800">
          <div />
          {days.map((dateIso, i) => {
            const isToday = dateIso === todayIso;
            return (
              <div key={dateIso} className="py-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {DAY_HEADERS[i]}
                </span>{" "}
                <span
                  className={
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs " +
                    (isToday
                      ? "bg-penn-red-600 font-semibold text-white"
                      : "text-neutral-500 dark:text-neutral-400")
                  }
                >
                  {Number(dateIso.slice(8, 10))}
                </span>
              </div>
            );
          })}
        </div>

        {/* All-day banner row (holidays) */}
        {hasAllDay && (
          <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-neutral-200 dark:border-neutral-800">
            <div className="py-1 pr-2 text-right text-[10px] text-neutral-400 dark:text-neutral-500">
              all day
            </div>
            {days.map((dateIso) => (
              <div
                key={dateIso}
                className="border-l border-neutral-100 p-1 dark:border-neutral-800/60"
              >
                {(events[dateIso] ?? [])
                  .filter((ev) => !ev.start || !ev.end)
                  .map((ev, j) => (
                    <span
                      key={j}
                      title={ev.label}
                      className={
                        "block truncate rounded px-1.5 py-0.5 text-[10px] leading-snug " +
                        chipClass[ev.type]
                      }
                    >
                      {ev.label}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        )}

        {/* 24-hour time grid */}
        <div ref={scrollRef} className="max-h-[560px] overflow-y-auto">
          <div
            className="grid grid-cols-[3.5rem_repeat(7,1fr)]"
            style={{ height: 24 * HOUR_HEIGHT }}
          >
            {/* Hour gutter */}
            <div className="relative">
              {Array.from({ length: 24 }, (_, h) => (
                <span
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-[10px] text-neutral-400 dark:text-neutral-500"
                  style={{ top: h * HOUR_HEIGHT }}
                >
                  {h === 0 ? "" : hourLabel(h)}
                </span>
              ))}
            </div>

            {days.map((dateIso) => {
              const timed = (events[dateIso] ?? []).filter(
                (ev): ev is TimedEvent => Boolean(ev.start && ev.end)
              );
              const { placed, lanes } = layoutDay(timed);
              const isToday = dateIso === todayIso;
              return (
                <div
                  key={dateIso}
                  className={
                    "relative border-l border-neutral-100 dark:border-neutral-800/60 " +
                    (isToday ? "bg-penn-red-50/40 dark:bg-penn-red-900/10" : "")
                  }
                >
                  {/* Hour lines */}
                  {Array.from({ length: 23 }, (_, h) => (
                    <div
                      key={h}
                      className="absolute inset-x-0 border-t border-neutral-100 dark:border-neutral-800/60"
                      style={{ top: (h + 1) * HOUR_HEIGHT }}
                    />
                  ))}

                  {/* Current time indicator */}
                  {isToday && (
                    <div
                      className="absolute inset-x-0 z-10 border-t-2 border-penn-red-600"
                      style={{ top: (nowMinutes / 60) * HOUR_HEIGHT }}
                    />
                  )}

                  {/* Events */}
                  {placed.map(({ ev, start, end, lane }, j) => (
                    <div
                      key={j}
                      title={
                        `${ev.label} (${formatTimeRange(ev.start, ev.end)})` +
                        (ev.location ? `, ${ev.location}` : "")
                      }
                      className={
                        "absolute overflow-hidden rounded border border-white/40 px-1.5 py-0.5 text-[11px] leading-snug dark:border-black/20 " +
                        chipClass[ev.type]
                      }
                      style={{
                        top: (start / 60) * HOUR_HEIGHT,
                        height: Math.max(((end - start) / 60) * HOUR_HEIGHT, 18),
                        left: `${(lane / lanes) * 100}%`,
                        width: `${100 / lanes}%`,
                      }}
                    >
                      <span className="font-medium">{ev.label}</span>
                      <span className="block text-[10px] opacity-75">
                        {formatTimeRange(ev.start, ev.end)}
                      </span>
                      {ev.location && (
                        <span className="block truncate text-[10px] opacity-75">
                          {ev.location}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${pad(m)}${suffix}`;
}

function formatTimeRange(start: string, end: string): string {
  return `${formatTime12(start)} to ${formatTime12(end)}`;
}
