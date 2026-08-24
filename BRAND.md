# CIS 5200 Brand & Design Tokens

Visual identity reference for anyone making course material: web pages, slide decks,
handouts, problem sets. `tailwind.config.ts` is the source of truth; this file
explains it. `AGENTS.md` covers architecture and content conventions.

## Logo

A 2-3-2 feedforward network on a white rounded tile. Input and hidden nodes are Penn
Blue; the two output nodes are Penn Red and drawn larger. 48x48 viewBox, tile corner
radius 10 (20.8%), node columns at x = 10, 24, 38.

Drawn twice, because thin strokes vanish at favicon size:

| Variant | File | Edge stroke | Node radius | Tile stroke |
| --- | --- | --- | --- | --- |
| Large (>40px) | `components/Logo.tsx` | 1.4 @ 35% | 3 / 4 | 1.5, theme-aware |
| Small (<=40px) | `app/icon.svg` | 2.2 @ 40% | 3.8 / 5 | 2, `#C8CEDA` |

PNG exports live in `public/icon/` at 512 and 1024. The `-square` versions have a baked
white background; use those anywhere transparency renders badly (Canvas, Ed, Slack,
Zoom, PowerPoint).

The white tile is part of the mark in both light and dark contexts. Do not recolor the
nodes, float bare nodes on a colored background, or add a drop shadow.

## Color

Penn Blue is structural (headings, links, active state). Penn Red is the accent
(eyebrows, hover, focus rings, exams, current week). Everything else is stock Tailwind
`neutral`. The `600` step is the true Penn value and the default for a bare
`penn-blue` / `penn-red`.

```
penn-blue-600  #011F5B   rgb(1, 31, 91)
penn-red-600   #990000   rgb(153, 0, 0)
```

Full scales are in `tailwind.config.ts`.

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `white` | `neutral-950` |
| Card surface | `white` | `neutral-900` |
| Subtle fill | `neutral-50` | `neutral-900` |
| Border | `neutral-200` | `neutral-800` |
| Heading | `penn-blue-600` | `white` |
| Body | `neutral-700` | `neutral-300` |
| Muted | `neutral-500` | `neutral-400` |
| Emphasis | `neutral-900` | `neutral-100` |
| Eyebrow / accent | `penn-red-600` | `penn-red-400` |
| Link | `penn-blue-600` | `penn-blue-300` |
| Hover | `penn-red-600` | `penn-red-400` |
| Focus ring | `penn-red-500`, offset 2 | `penn-red-400`, offset 2 |

Two functional tints, used **only** in `ScheduleTable`: amber for the homework column
(`amber-50/70` header, `amber-50/40` cells) and rose for exams (`rose-50/70`,
`rose-50/40`). Current week washes `penn-red-50/40`.

`SpinWheel` runs its own six-color rotation (`#E05C5C #E8863C #E5C04B #57B65A #4A7FE0
#8B5CF6`), deliberately off-brand. Do not reuse it elsewhere.

## Typography

Inter only, loaded via `next/font/google` with `display: swap`, Latin subset. No second
typeface anywhere. Weights in use: 400 body, 500 medium, 600 semibold, 700 for page
titles. Fallback stack is `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`,
`Helvetica Neue`, `Arial`.

| Token | Size / line | Used for |
| --- | --- | --- |
| `text-[10px]` | 10px | Badges and pills, uppercase only |
| `text-xs` | 12 / 16 | Eyebrows, captions, table headers, metadata |
| `text-sm` | 14 / 20 | Body copy, nav, tables, buttons |
| `text-base` | 16 / 24 | Card headings, sidebar wordmark |
| `text-xl` | 20 / 28 | Subsection headings |
| `text-2xl` | 24 / 32 | Section headings |
| `text-3xl` | 30 / 36 | Page title, mobile |
| `text-4xl` | 36 / 40 | Page title, >=640px |

Body text is 14px, not 16px: the site runs a notch tighter than a marketing page because
it is dense reference material.

Letter-spacing: `tracking-tight` on headings, `tracking-[0.18em]` on eyebrows,
`tracking-wider` on badges and table headers. Never on lowercase body text.

## Layout & shape

- Content width: `max-w-content` = 72rem / 1152px (custom token).
- Page wrapper: `mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12`.
- Sidebar `w-64` desktop, `w-72` mobile drawer. Top bar `h-16`, sticky, `bg-white/80`
  with `backdrop-blur`. Footer `mt-24`.
- Radii: `rounded-md` (6px) for controls, nav, inputs, buttons; `rounded-lg` (8px) for
  cards and table containers; `rounded-full` for pills only.
- Elevation: flat with a 1px border. Shadow only on hover (`shadow-sm`, `shadow-md`) and
  the mobile drawer (`shadow-xl`).
- Motion: `transition-colors` everywhere; `hover:-translate-y-0.5` on quick-link cards is
  the only movement on the site.
- Spacing sticks to a 4px step, mostly `px-3`/`px-4` and `py-2`/`py-3`; cards `p-4`/`p-5`.

## Component recipes

Page header:

```
eyebrow  text-xs font-semibold uppercase tracking-[0.18em] text-penn-red-600 dark:text-penn-red-400
title    mt-3 text-3xl font-bold tracking-tight text-penn-blue-600 sm:text-4xl dark:text-white
desc     mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300
```

Card surface:

```
rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900
```

Interactive card adds `group transition-all hover:-translate-y-0.5
hover:border-penn-blue-300 hover:shadow-md dark:hover:border-penn-blue-400/60`.

Badge:

```
inline-flex items-center rounded-full bg-penn-red-50 px-2 py-0.5 text-[10px]
font-semibold uppercase tracking-wider text-penn-red-700
dark:bg-penn-red-950 dark:text-penn-red-300
```

Table: wrapper `overflow-x-auto rounded-lg border border-neutral-200
dark:border-neutral-800`; `thead` `bg-neutral-50 dark:bg-neutral-900`; `th` `px-3 py-3
text-left text-xs font-semibold uppercase tracking-wider text-neutral-600
dark:text-neutral-300`; `tbody` `divide-y divide-neutral-200 dark:divide-neutral-800`.

Empty cell placeholder is an en dash in `text-neutral-400 dark:text-neutral-600`, never
a hyphen and never "N/A".

Markdown pages render through `@tailwindcss/typography` with brand overrides (see
`components/MarkdownContent.tsx`), so plain markdown in `content/` comes out styled.

## Dark mode

Class-based (`darkMode: "class"`). An inline script in `app/layout.tsx` runs before
hydration, reads `localStorage.theme`, falls back to `prefers-color-scheme`, and stamps
`.dark` on `<html>`. Every component needs both halves.

Two things that do not invert naively: Penn Blue 600 is too dark on a dark ground, so
headings become plain `white` and links become `penn-blue-300`; and tinted fills need
opacity rather than a lighter step (`penn-blue-900/40`, not `penn-blue-800`).

## Off the web

| Name | HEX | RGB |
| --- | --- | --- |
| Penn Blue | `#011F5B` | 1, 31, 91 |
| Penn Red | `#990000` | 153, 0, 0 |
| Ink (neutral-900) | `#171717` | 23, 23, 23 |
| Body (neutral-700) | `#404040` | 64, 64, 64 |
| Muted (neutral-500) | `#737373` | 115, 115, 115 |
| Rule (neutral-200) | `#E5E5E5` | 229, 229, 229 |
| Wash (neutral-50) | `#FAFAFA` | 250, 250, 250 |

Slides: 16:9, white ground, Penn Blue titles. Deck title 40pt Bold, slide title 30pt
Semibold, body 20pt, sub-bullet 18pt, caption 14pt. `-square` logo bottom-right at ~40px.

Handouts: Letter, 1in margins, Inter 11pt body / 15pt leading, section heads 14pt
Semibold Penn Blue.

Inter is free from rsms.me/inter or Google Fonts, and is built into Google Slides and
Docs under "More fonts". Fallback is Helvetica Neue or Arial, never Calibri.

LaTeX preamble:

```latex
\usepackage[dvipsnames]{xcolor}
\definecolor{pennblue}{HTML}{011F5B}
\definecolor{pennred}{HTML}{990000}
\definecolor{pennrule}{HTML}{E5E5E5}

\usepackage[colorlinks=true, linkcolor=pennblue,
            urlcolor=pennblue, citecolor=pennblue]{hyperref}

\usepackage{sectsty}
\allsectionsfont{\color{pennblue}\sffamily\bfseries}

% XeLaTeX or LuaLaTeX only
\usepackage{fontspec}
\setsansfont{Inter}
\renewcommand{\familydefault}{\sfdefault}
```

## Copy rules

- **No em dashes anywhere**: content, UI strings, code comments, slide titles. Use a
  colon, semicolon, comma, parentheses, or "by"/"to". En dashes are fine for ranges
  (1:45-3:14pm) and as the empty table-cell placeholder.
- Dates are ISO `YYYY-MM-DD` in content files; sorting is lexicographic.
- Times are 24-hour `HH:MM`, local Philadelphia time. Weekdays are `MO` through `SU`.
- A spaced middot joins inline facts: instructor, time, location.
- Course facts (names, dates, rooms, links) live in `content/config.json` and
  `content/schedule.json`. Never hardcode them into a component or a deck template.
- Files are lowercase kebab-case: `ta-resources.md`, `jane-doe.jpg`.
