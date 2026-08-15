import { getConfig } from "@/lib/content";

export default function Footer() {
  const config = getConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto grid max-w-content gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-penn-blue-600 dark:text-white">
            {config.course.code}: {config.course.title}
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            University of Pennsylvania
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {config.semester.label}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Course Tools
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={config.links.ed}
                className="text-neutral-700 transition-colors hover:text-penn-red-600 dark:text-neutral-300 dark:hover:text-penn-red-400"
              >
                Ed Discussion
              </a>
            </li>
            <li>
              <a
                href={config.links.canvas}
                className="text-neutral-700 transition-colors hover:text-penn-red-600 dark:text-neutral-300 dark:hover:text-penn-red-400"
              >
                Canvas
              </a>
            </li>
            <li>
              <a
                href={config.links.gradescope}
                className="text-neutral-700 transition-colors hover:text-penn-red-600 dark:text-neutral-300 dark:hover:text-penn-red-400"
              >
                Gradescope
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Student Resources
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={config.links.weingarten}
                className="text-neutral-700 transition-colors hover:text-penn-red-600 dark:text-neutral-300 dark:hover:text-penn-red-400"
              >
                Weingarten Learning Resources Center
              </a>
            </li>
            <li>
              <a
                href={config.links.officeHoursCalendar}
                className="text-neutral-700 transition-colors hover:text-penn-red-600 dark:text-neutral-300 dark:hover:text-penn-red-400"
              >
                Office Hours Calendar
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <p className="mx-auto max-w-content px-4 py-4 text-xs text-neutral-500 sm:px-6 lg:px-8 dark:text-neutral-500">
          © {year} {config.course.code}. University of Pennsylvania, School of
          Engineering and Applied Science.
        </p>
      </div>
    </footer>
  );
}
