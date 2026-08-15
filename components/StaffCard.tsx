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
const globePath =
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.45a15.6 15.6 0 0 0-1.2-5.51A8.03 8.03 0 0 1 19.93 11zM12 4.06c.9 1.2 1.9 3.55 2.16 6.94H9.84c.26-3.39 1.26-5.74 2.16-6.94zM4.07 13h3.45c.13 2.09.55 3.98 1.2 5.51A8.03 8.03 0 0 1 4.07 13zm3.45-2H4.07a8.03 8.03 0 0 1 4.65-5.51A15.6 15.6 0 0 0 7.52 11zm4.48 8.94c-.9-1.2-1.9-3.55-2.16-6.94h4.32c-.26 3.39-1.26 5.74-2.16 6.94zm2.28-1.43c.65-1.53 1.07-3.42 1.2-5.51h3.45a8.03 8.03 0 0 1-4.65 5.51z";

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
            {member.name}
          </h3>
          <div className="flex items-center gap-2">
            {member.linkedin && (
              <LinkIcon href={member.linkedin} label={`${member.name} on LinkedIn`} path={linkedinPath} />
            )}
            {member.website && (
              <LinkIcon href={member.website} label={`${member.name}'s website`} path={globePath} />
            )}
          </div>
        </div>
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
