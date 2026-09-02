import {
  getSchedule,
  getWeekNumber,
  type Exam,
  type Homework,
  type Lecture,
  type Recitation,
} from "@/lib/content";

function formatLectureDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return { day, monthDate: `${month} ${d.getDate()}` };
}

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ScheduleTable({
  currentWeek,
}: {
  currentWeek: number | null;
}) {
  const { lectures, recitations, homeworks, exams } = getSchedule();

  const byWeek = new Map<number, Lecture[]>();
  for (const lecture of lectures) {
    const w = getWeekNumber(lecture.date);
    const arr = byWeek.get(w) ?? [];
    arr.push(lecture);
    byWeek.set(w, arr);
  }

  const recitationsByWeek = new Map<number, Recitation>();
  for (const r of recitations) recitationsByWeek.set(r.week, r);

  const homeworksByWeek = new Map<number, Homework[]>();
  for (const h of homeworks) {
    const w = getWeekNumber(h.due);
    const arr = homeworksByWeek.get(w) ?? [];
    arr.push(h);
    homeworksByWeek.set(w, arr);
  }

  const examsByWeek = new Map<number, Exam[]>();
  for (const e of exams) {
    const arr = examsByWeek.get(e.week) ?? [];
    arr.push(e);
    examsByWeek.set(e.week, arr);
  }

  const weeks = Array.from(byWeek.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            <th scope="col" className="w-14 px-3 py-3 text-center">
              Wk.
            </th>
            <th scope="col" className="w-32 px-3 py-3">
              Date
            </th>
            <th scope="col" className="px-3 py-3">
              Lecture
            </th>
            <th scope="col" className="px-3 py-3">
              Recitation
            </th>
            <th
              scope="col"
              className="bg-amber-50/70 px-3 py-3 dark:bg-amber-950/30"
            >
              Homework
            </th>
            <th
              scope="col"
              className="bg-rose-50/70 px-3 py-3 dark:bg-rose-950/30"
            >
              Exams
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {weeks.map(([weekNum, weekLectures]) => {
            const isCurrent = currentWeek === weekNum;
            const recitation = recitationsByWeek.get(weekNum);
            const weekHomeworks = homeworksByWeek.get(weekNum) ?? [];
            const weekExams = examsByWeek.get(weekNum) ?? [];

            return weekLectures.map((lecture, idx) => {
              const { day, monthDate } = formatLectureDate(lecture.date);
              const firstOfWeek = idx === 0;
              return (
                <tr
                  key={lecture.date}
                  id={firstOfWeek ? `week-${weekNum}` : undefined}
                  className={
                    isCurrent
                      ? "bg-penn-red-50/40 dark:bg-penn-red-950/20"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                  }
                >
                  {firstOfWeek && (
                    <td
                      rowSpan={weekLectures.length}
                      className={
                        "border-r border-neutral-200 px-3 py-3 text-center align-top text-sm font-semibold dark:border-neutral-800 " +
                        (isCurrent
                          ? "text-penn-red-700 dark:text-penn-red-300"
                          : "text-neutral-700 dark:text-neutral-300")
                      }
                    >
                      {weekNum}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {day}
                      </span>
                      <time
                        dateTime={lecture.date}
                        className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
                      >
                        {monthDate}
                      </time>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <LectureCell lecture={lecture} />
                  </td>
                  {firstOfWeek && (
                    <td
                      rowSpan={weekLectures.length}
                      className="px-3 py-3 align-top"
                    >
                      <RecitationCell recitation={recitation} />
                    </td>
                  )}
                  {firstOfWeek && (
                    <td
                      rowSpan={weekLectures.length}
                      className="bg-amber-50/40 px-3 py-3 align-top dark:bg-amber-950/15"
                    >
                      <HomeworkCell items={weekHomeworks} />
                    </td>
                  )}
                  {firstOfWeek && (
                    <td
                      rowSpan={weekLectures.length}
                      className="bg-rose-50/40 px-3 py-3 align-top dark:bg-rose-950/15"
                    >
                      <ExamCell items={weekExams} />
                    </td>
                  )}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}

/** A link is "live" once content has a real URL; "#" is the placeholder. */
function isLive(href?: string): href is string {
  return Boolean(href) && href !== "#";
}

function SubLink({ href, label }: { href: string; label: string }) {
  if (!isLive(href)) {
    return (
      <span
        className="text-xs font-medium text-neutral-400 dark:text-neutral-600"
        title="Not yet available"
      >
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
    >
      {label}
    </a>
  );
}

function LectureCell({ lecture }: { lecture: Lecture }) {
  if (lecture.isHoliday) {
    return (
      <span className="italic text-neutral-500 dark:text-neutral-400">
        {lecture.topic}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {lecture.topic}
      </span>
      {(lecture.recording || lecture.notes) && (
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          {lecture.recording && (
            <SubLink href={lecture.recording} label="Recording" />
          )}
          {lecture.recording && lecture.notes && <span aria-hidden>·</span>}
          {lecture.notes && <SubLink href={lecture.notes} label="Notes" />}
        </div>
      )}
    </div>
  );
}

function RecitationCell({ recitation }: { recitation?: Recitation }) {
  if (!recitation) {
    return <span className="text-neutral-400 dark:text-neutral-600">–</span>;
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {recitation.title}
      </span>
      {recitation.slides && (
        <SubLink href={recitation.slides} label="Slides" />
      )}
    </div>
  );
}

function HomeworkCell({ items }: { items: Homework[] }) {
  if (items.length === 0) {
    return <span className="text-neutral-400 dark:text-neutral-600">–</span>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((hw) => (
        <li key={hw.name} className="flex flex-col leading-tight">
          {isLive(hw.href) ? (
            <a
              href={hw.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
            >
              {hw.name}
            </a>
          ) : (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {hw.name}
            </span>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            due {formatShortDate(hw.due)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ExamCell({ items }: { items: Exam[] }) {
  if (items.length === 0) {
    return <span className="text-neutral-400 dark:text-neutral-600">–</span>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((ex) => (
        <li key={ex.name} className="flex flex-col leading-tight">
          {isLive(ex.href) ? (
            <a
              href={ex.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-penn-red-600 underline-offset-2 hover:underline dark:text-penn-red-300"
            >
              {ex.name}
            </a>
          ) : (
            <span className="font-medium text-penn-red-700 dark:text-penn-red-300">
              {ex.name}
            </span>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {ex.dateLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}
