import type { ReactNode } from "react";

export type QuickLinkProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export default function QuickLinkCard({
  href,
  title,
  description,
  icon,
}: QuickLinkProps) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-penn-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-penn-blue-400/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-penn-blue-50 text-penn-blue-600 transition-colors group-hover:bg-penn-blue-600 group-hover:text-white dark:bg-penn-blue-900/40 dark:text-penn-blue-200 dark:group-hover:bg-penn-blue-500 dark:group-hover:text-white">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-neutral-900 group-hover:text-penn-blue-600 dark:text-white dark:group-hover:text-penn-blue-200">
          {title}
        </span>
        <span className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </span>
      </span>
    </a>
  );
}
