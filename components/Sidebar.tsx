"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getConfig } from "@/lib/content";

type NavLeaf = { label: string; href: string };
type NavGroup = { label: string; children: NavLeaf[] };
type NavItem = NavLeaf | NavGroup;

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Course Info",
    children: [
      { label: "Syllabus", href: "/course-info/syllabus" },
      { label: "Policies", href: "/course-info/policies" },
      { label: "Grading", href: "/course-info/grading" },
      {
        label: "Similar Courses at Penn",
        href: "/course-info/similar-courses",
      },
    ],
  },
  { label: "Staff", href: "/staff" },
  { label: "Calendar", href: "/calendar" },
  { label: "Resources", href: "/resources" },
];

function isLeaf(item: NavItem): item is NavLeaf {
  return "href" in item;
}

function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function slug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const config = getConfig();
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  function groupHasActiveChild(group: NavGroup) {
    return group.children.some((c) => isActiveHref(pathname, c.href));
  }

  function isGroupOpen(group: NavGroup): boolean {
    if (group.label in overrides) return overrides[group.label];
    return groupHasActiveChild(group);
  }

  function toggleGroup(group: NavGroup, currentlyOpen: boolean) {
    setOverrides((prev) => ({ ...prev, [group.label]: !currentlyOpen }));
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <Link
        href="/"
        onClick={onNavigate}
        className="group flex items-center gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-penn-red-600 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-penn-red-700">
          CIS
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-penn-blue-600 dark:text-white">
            CIS 5200
          </span>
          <span className="text-xs font-medium text-penn-blue-600 dark:text-white">
            Machine Learning
          </span>
        </span>
      </Link>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {navLinks.map((item) => {
            if (isLeaf(item)) {
              const active = isActiveHref(pathname, item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                      (active
                        ? "bg-penn-blue-50 text-penn-blue-700 dark:bg-penn-blue-900/40 dark:text-penn-blue-100"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-penn-red-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-penn-red-400")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const open = isGroupOpen(item);
            const groupActive = groupHasActiveChild(item);
            const panelId = `nav-${slug(item.label)}`;

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item, open)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className={
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                    (groupActive
                      ? "text-penn-blue-700 dark:text-penn-blue-100"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-penn-red-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-penn-red-400")
                  }
                >
                  <span>{item.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={
                      "h-4 w-4 transition-transform " +
                      (open ? "rotate-180" : "")
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {open && (
                  <ul
                    id={panelId}
                    className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-neutral-200 pl-2 dark:border-neutral-800"
                  >
                    {item.children.map((child) => {
                      const active = isActiveHref(pathname, child.href);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={
                              "block rounded-md px-3 py-1.5 text-sm transition-colors " +
                              (active
                                ? "bg-penn-blue-50 font-medium text-penn-blue-700 dark:bg-penn-blue-900/40 dark:text-penn-blue-100"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-penn-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-penn-red-400")
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-200 px-5 py-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p className="font-medium text-neutral-700 dark:text-neutral-300">
          {config.semester.label}
        </p>
        <p className="mt-0.5">University of Pennsylvania</p>
      </div>
    </div>
  );
}
