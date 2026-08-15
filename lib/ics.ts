import {
  getConfig,
  getOfficeHours,
  getSchedule,
  type Weekday,
} from "@/lib/content";

const TZID = "America/New_York";

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0400",
  "TZNAME:EDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0400",
  "TZOFFSETTO:-0500",
  "TZNAME:EST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const WEEKDAY_OFFSET: Record<Weekday, number> = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6,
};

// ICS TEXT values must escape backslash, semicolon, comma, and newlines.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// "2026-08-26" + "13:45" -> "20260826T134500"
function localDateTime(dateIso: string, time: string): string {
  return `${dateIso.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function addDays(dateIso: string, days: number): string {
  const d = new Date(dateIso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function event(lines: Array<string | false | undefined>): string[] {
  return [
    "BEGIN:VEVENT",
    ...(lines.filter(Boolean) as string[]),
    "END:VEVENT",
  ];
}

export function buildCalendarIcs(): string {
  const config = getConfig();
  const { lectures } = getSchedule();
  const officeHours = getOfficeHours();
  const { lectureStartTime, lectureEndTime, location, weekOneMonday, lastDay } =
    config.semester;
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CIS 5200//Course Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`${config.course.code} ${config.semester.label}`)}`,
    `X-WR-TIMEZONE:${TZID}`,
    ...VTIMEZONE,
  ];

  for (const lecture of lectures) {
    if (lecture.isHoliday) continue;
    lines.push(
      ...event([
        `UID:lecture-${lecture.date}@cis5200.com`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;TZID=${TZID}:${localDateTime(lecture.date, lectureStartTime)}`,
        `DTEND;TZID=${TZID}:${localDateTime(lecture.date, lectureEndTime)}`,
        `SUMMARY:${escapeText(`${config.course.code} Lecture: ${lecture.topic}`)}`,
        `LOCATION:${escapeText(location)}`,
      ])
    );
  }

  for (const oh of officeHours) {
    const firstDate = addDays(weekOneMonday, WEEKDAY_OFFSET[oh.weekday]);
    // UNTIL must be UTC; end of the last day in EST is safely covered by 23:59Z + 1 day.
    const until = `${addDays(lastDay, 1).replace(/-/g, "")}T045959Z`;
    lines.push(
      ...event([
        `UID:oh-${oh.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${oh.weekday}-${oh.start.replace(":", "")}@cis5200.com`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;TZID=${TZID}:${localDateTime(firstDate, oh.start)}`,
        `DTEND;TZID=${TZID}:${localDateTime(firstDate, oh.end)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${oh.weekday};UNTIL=${until}`,
        `SUMMARY:${escapeText(`${config.course.code} Office Hours: ${oh.name}`)}`,
        `LOCATION:${escapeText(oh.location)}`,
      ])
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
