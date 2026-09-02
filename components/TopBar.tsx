"use client";

import ThemeToggle from "./ThemeToggle";
import { getConfig } from "@/lib/content";

export default function TopBar({
  onMenuClick,
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}) {
  const config = getConfig();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-neutral-800 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-950/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-penn-red-600 md:hidden dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-penn-red-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          aria-pressed={!sidebarCollapsed}
          title={`${sidebarCollapsed ? "Show" : "Hide"} sidebar (⌘B)`}
          className="hidden h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-penn-red-600 md:inline-flex dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-penn-red-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="9" y1="4" x2="9" y2="20" />
          </svg>
        </button>

        <div className="flex max-w-md flex-1 items-center">
          <label htmlFor="site-search" className="sr-only">
            Search CIS 5200
          </label>
          <div className="relative w-full">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="site-search"
              type="search"
              placeholder="Search CIS 5200"
              className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors hover:border-neutral-300 focus:border-penn-red-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-700 dark:focus:border-penn-red-400"
            />
          </div>
        </div>

        <nav
          aria-label="External course tools"
          className="ml-auto hidden items-center gap-1 sm:flex"
        >
          <a
            href={config.links.ed}
            className="rounded-md px-3 py-2 text-sm font-medium text-penn-blue-600 transition-colors hover:bg-penn-blue-50 hover:text-penn-blue-700 dark:text-penn-blue-200 dark:hover:bg-penn-blue-900/30 dark:hover:text-white"
          >
            Ed
          </a>
          <a
            href={config.links.canvas}
            className="rounded-md px-3 py-2 text-sm font-medium text-penn-blue-600 transition-colors hover:bg-penn-blue-50 hover:text-penn-blue-700 dark:text-penn-blue-200 dark:hover:bg-penn-blue-900/30 dark:hover:text-white"
          >
            Canvas
          </a>
          <a
            href={config.links.gradescope}
            className="rounded-md px-3 py-2 text-sm font-medium text-penn-blue-600 transition-colors hover:bg-penn-blue-50 hover:text-penn-blue-700 dark:text-penn-blue-200 dark:hover:bg-penn-blue-900/30 dark:hover:text-white"
          >
            Gradescope
          </a>
          <a
            href={config.links.panopto}
            className="rounded-md px-3 py-2 text-sm font-medium text-penn-blue-600 transition-colors hover:bg-penn-blue-50 hover:text-penn-blue-700 dark:text-penn-blue-200 dark:hover:bg-penn-blue-900/30 dark:hover:text-white"
          >
            Panopto
          </a>
        </nav>

        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
