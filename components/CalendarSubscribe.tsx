"use client";

import { useEffect, useState } from "react";

const buttonClass =
  "inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-penn-red-300 hover:text-penn-red-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-penn-red-500/40 dark:hover:text-penn-red-400";

export default function CalendarSubscribe() {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const webcalUrl = host ? `webcal://${host}/calendar.ics` : "#";
  const googleUrl = host
    ? `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`
    : "#";

  return (
    <div className="flex flex-wrap gap-3">
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        Add to Google Calendar
      </a>
      <a href={webcalUrl} className={buttonClass}>
        Add to Apple / Outlook Calendar
      </a>
      <a href="/calendar.ics" download="cis5200.ics" className={buttonClass}>
        Download .ics file
      </a>
    </div>
  );
}
