import Image from "next/image";
import type { StaffMember } from "@/lib/content";

function PersonPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
      <svg
        viewBox="0 0 24 24"
        className="h-16 w-16 text-neutral-300 dark:text-neutral-600"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-3.9 0-8.25 2.02-8.25 5.06V21h16.5v-1.69c0-3.04-4.35-5.06-8.25-5.06Z" />
      </svg>
    </div>
  );
}

function LinkIcon({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="text-neutral-400 transition-colors hover:text-penn-red-600 dark:text-neutral-500 dark:hover:text-penn-red-400"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

const linkedinPath =
  "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.75H5.67v8.59h2.67zM7 8.48a1.56 1.56 0 1 0 0-3.12 1.56 1.56 0 0 0 0 3.12zm11.34 9.86v-4.7c0-2.52-1.34-3.69-3.13-3.69-1.44 0-2.09.79-2.45 1.35v-1.55h-2.67c.04.75 0 8.59 0 8.59h2.67v-4.8c0-.26.02-.51.1-.7.2-.51.66-1.04 1.43-1.04 1.01 0 1.41.77 1.41 1.9v4.64h2.64z";
const githubPath =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
const calendarPath =
  "M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm11 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8zM8 13a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z";

export default function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-square w-full">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Headshot of ${member.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <PersonPlaceholder />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {member.website ? (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-penn-red-600 hover:underline dark:hover:text-penn-red-400"
              >
                {member.name}
              </a>
            ) : (
              member.name
            )}
          </h3>
          <div className="flex items-center gap-2">
            {member.linkedin && (
              <LinkIcon href={member.linkedin} label={`${member.name} on LinkedIn`} path={linkedinPath} />
            )}
            {member.github && (
              <LinkIcon href={member.github} label={`${member.name} on GitHub`} path={githubPath} />
            )}
            {member.calendly && (
              <LinkIcon href={member.calendly} label={`Book time with ${member.name}`} path={calendarPath} />
            )}
          </div>
        </div>
        {(member.major || member.year) && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {[
              member.major,
              member.year &&
                (/^\d{4}$/.test(member.year)
                  ? `Class of ${member.year}`
                  : member.year),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="break-all text-xs text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
          >
            {member.email}
          </a>
        )}
        {member.bio && (
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}
