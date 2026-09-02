import PageHeader from "@/components/PageHeader";
import CalendarSubscribe from "@/components/CalendarSubscribe";
import CalendarPreview, {
  type PreviewEvent,
} from "@/components/CalendarPreview";
import {
  getConfig,
  getOfficeHours,
  getSchedule,
  type Weekday,
} from "@/lib/content";

export const metadata = { title: "Calendar" };

const WEEKDAY_LABEL: Record<string, string> = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
  SU: "Sunday",
};

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}${suffix}`;
}

const WEEKDAY_OFFSET: Record<Weekday, number> = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6,
};

function addDays(dateIso: string, days: number): string {
  const d = new Date(dateIso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildPreviewData() {
  const { semester } = getConfig();
  const { lectures, exams } = getSchedule();
  const officeHours = getOfficeHours();

  const events: Record<string, PreviewEvent[]> = {};
  const push = (date: string, ev: PreviewEvent) => {
    (events[date] ??= []).push(ev);
  };

  for (const lecture of lectures) {
    if (lecture.isHoliday) {
      push(lecture.date, { label: lecture.topic, type: "holiday" });
    } else {
      push(lecture.date, {
        label: `Lecture: ${lecture.topic}`,
        type: "lecture",
        start: semester.lectureStartTime,
        end: semester.lectureEndTime,
        location: semester.location,
      });
    }
  }

  // Exams have no fixed time yet, so they render in the all-day row.
  for (const exam of exams) {
    if (!exam.date) continue;
    push(exam.date, { label: exam.name, type: "exam" });
  }

  for (const oh of officeHours) {
    for (
      let date = addDays(semester.weekOneMonday, WEEKDAY_OFFSET[oh.weekday]);
      date <= semester.lastDay;
      date = addDays(date, 7)
    ) {
      push(date, {
        label: `OH: ${oh.name}`,
        type: "oh",
        start: oh.start,
        end: oh.end,
        location: oh.location,
      });
    }
  }

  const months: string[] = [];
  let m = semester.weekOneMonday.slice(0, 7);
  const lastMonth = semester.lastDay.slice(0, 7);
  while (m <= lastMonth) {
    months.push(m);
    const [y, mo] = m.split("-").map(Number);
    m = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`;
  }

  return { months, events };
}

export default function CalendarPage() {
  const config = getConfig();
  const officeHours = getOfficeHours();
  const { months, events } = buildPreviewData();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <PageHeader eyebrow="Calendar" title="Course Calendar" />

      <section aria-label="Calendar preview">
        <CalendarPreview
          months={months}
          events={events}
          weekOneMonday={config.semester.weekOneMonday}
          lastDay={config.semester.lastDay}
        />
      </section>

      <section aria-label="Subscribe" className="mt-6">
        <CalendarSubscribe />
      </section>

      <section aria-labelledby="lectures-heading" className="mt-10">
        <h2
          id="lectures-heading"
          className="text-xl font-semibold tracking-tight text-penn-blue-600 dark:text-white"
        >
          Lectures
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          {config.semester.meetingTime} in {config.semester.location}. See the{" "}
          <a
            href="/"
            className="font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
          >
            weekly schedule
          </a>{" "}
          for topics.
        </p>
      </section>

      <section aria-labelledby="oh-heading" className="mt-10">
        <h2
          id="oh-heading"
          className="text-xl font-semibold tracking-tight text-penn-blue-600 dark:text-white"
        >
          TA Office Hours
        </h2>
        {officeHours.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            Office hours will be announced at the start of the semester and
            added to the calendar here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-neutral-50 text-left dark:bg-neutral-900">
                <tr>
                  <th className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                    Day
                  </th>
                  <th className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                    Time
                  </th>
                  <th className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                    TA
                  </th>
                  <th className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                    Location
                  </th>
                  <th className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {officeHours.map((oh, i) => (
                  <tr
                    key={`${oh.name}-${oh.weekday}-${oh.start}`}
                    className={
                      i % 2 === 1 ? "bg-neutral-50/50 dark:bg-neutral-900/40" : ""
                    }
                  >
                    <td className="px-4 py-2 text-neutral-900 dark:text-neutral-100">
                      {WEEKDAY_LABEL[oh.weekday]}
                    </td>
                    <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                      {formatTime(oh.start)} to {formatTime(oh.end)}
                    </td>
                    <td className="px-4 py-2 text-neutral-900 dark:text-neutral-100">
                      {oh.name}
                    </td>
                    <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                      {oh.location}
                    </td>
                    <td className="px-4 py-2">
                      {oh.zoom ? (
                        <a
                          href={oh.zoom}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
                        >
                          Join
                        </a>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-600">
                          &ndash;
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
