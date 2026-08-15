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

export default function CalendarPreview({
  months,
  events,
}: {
  months: string[]; // "YYYY-MM", ascending
  events: Record<string, PreviewEvent[]>; // keyed by "YYYY-MM-DD"
}) {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const currentKey = todayIso.slice(0, 7);
  const initial = Math.max(0, months.indexOf(currentKey));
  const [index, setIndex] = useState(initial);

  const monthKey = months[index];
  const [year, month] = monthKey.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const navButton =
    "rounded-md border border-neutral-200 px-2.5 py-1 text-sm text-neutral-700 transition-colors enabled:hover:border-penn-red-300 enabled:hover:text-penn-red-600 disabled:opacity-40 dark:border-neutral-800 dark:text-neutral-300 dark:enabled:hover:border-penn-red-500/40 dark:enabled:hover:text-penn-red-400";

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="Previous month"
            className={navButton}
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(months.length - 1, i + 1))}
            disabled={index === months.length - 1}
            aria-label="Next month"
            className={navButton}
          >
            &rarr;
          </button>
        </div>
      </div>

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
                "min-h-[76px] border-b border-r border-neutral-100 p-1.5 text-left align-top last:border-r-0 dark:border-neutral-800/60 " +
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
    </div>
  );
}
