import configJson from "@/content/config.json";
import announcementsJson from "@/content/announcements.json";
import scheduleJson from "@/content/schedule.json";
import staffJson from "@/content/staff.json";
import officeHoursJson from "@/content/office-hours.json";

export type CourseConfig = {
  course: {
    code: string;
    title: string;
    tagline: string;
    description: string;
  };
  semester: {
    label: string;
    meetingTime: string;
    lectureStartTime: string;
    lectureEndTime: string;
    location: string;
    weekOneMonday: string;
    lastDay: string;
  };
  instructor: {
    name: string;
    email: string;
    office: string;
    officeHours: string;
  };
  tas: Array<{ name: string; email: string; role: string }>;
  links: {
    ed: string;
    canvas: string;
    gradescope: string;
    panopto: string;
    officeHoursCalendar: string;
    weingarten: string;
    recitationPlaylist: string;
  };
};

export type Announcement = {
  date: string;
  title: string;
  body: string;
  pinned?: boolean;
};

export type Lecture = {
  date: string;
  topic: string;
  isHoliday?: boolean;
  recording?: string;
  notes?: string;
};

export type Recitation = {
  week: number;
  title: string;
  slides?: string;
  recording?: string;
  // Extra named links shown after Slides and Recording.
  links?: Array<{ label: string; href: string }>;
};

export type Homework = {
  name: string;
  due: string;
  href?: string;
};

export type Exam = {
  name: string;
  week: number;
  // ISO date the assessment falls on; drives the calendar feed and preview.
  date?: string;
  dateLabel: string;
  href?: string;
};

export type Schedule = {
  lectures: Lecture[];
  recitations: Recitation[];
  homeworks: Homework[];
  exams: Exam[];
};

export type StaffMember = {
  name: string;
  email?: string;
  major?: string;
  year?: string;
  photo?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  calendly?: string;
  bio?: string;
};

export type Staff = {
  instructor: StaffMember[];
  headTas: StaffMember[];
  tas: StaffMember[];
};

export function getStaff(): Staff {
  return staffJson as Staff;
}

export type Weekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export type OfficeHour = {
  name: string;
  weekday: Weekday;
  start: string;
  end: string;
  location: string;
  zoom?: string;
};

export function getOfficeHours(): OfficeHour[] {
  const order: Weekday[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  return [...(officeHoursJson as OfficeHour[])].sort(
    (a, b) =>
      order.indexOf(a.weekday) - order.indexOf(b.weekday) ||
      a.start.localeCompare(b.start)
  );
}

export function getConfig(): CourseConfig {
  return configJson as CourseConfig;
}

export function getAnnouncements(): Announcement[] {
  const items = announcementsJson as Announcement[];
  return [...items].sort((a, b) => {
    if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    }
    return b.date.localeCompare(a.date);
  });
}

export function getLatestAnnouncements(limit = 3): Announcement[] {
  return getAnnouncements().slice(0, limit);
}

export function getSchedule(): Schedule {
  const s = scheduleJson as Schedule;
  return {
    lectures: [...s.lectures].sort((a, b) => a.date.localeCompare(b.date)),
    recitations: [...s.recitations].sort((a, b) => a.week - b.week),
    homeworks: [...s.homeworks].sort((a, b) => a.due.localeCompare(b.due)),
    exams: [...s.exams].sort((a, b) => a.week - b.week),
  };
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.floor((db - da) / (1000 * 60 * 60 * 24));
}

export function getWeekNumber(date: string): number {
  const { weekOneMonday } = getConfig().semester;
  const diff = daysBetween(weekOneMonday, date);
  return Math.floor(diff / 7) + 1;
}

export function getCurrentWeek(today: Date = new Date()): number | null {
  const { weekOneMonday, lastDay } = getConfig().semester;
  // Campus-local date, so late evenings do not roll into the next week early.
  const iso = today.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  if (iso < weekOneMonday) return null;
  if (iso > lastDay) return null;
  return Math.floor(daysBetween(weekOneMonday, iso) / 7) + 1;
}
