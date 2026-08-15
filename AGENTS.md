# CIS 5200 Course Website

Public course website for CIS 5200 (Machine Learning) at the University of
Pennsylvania, Fall 2026 (~300 students). Static, read-only content site;
interactive course work (submissions, grades, Q&A) lives on Canvas,
Gradescope, and Ed, which this site only links to.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS 3 (+ `@tailwindcss/typography` for markdown prose)
- No database, no API routes, no auth. All pages are statically rendered.
- Content is parsed with `gray-matter` (frontmatter) and `marked` (markdown to HTML).

## Commands

- `npm run dev`: dev server at localhost:3000
- `npm run build`: production build; must pass before pushing
- `npm run lint`: ESLint (eslint-config-next)

## Architecture

Content (data) is strictly separated from rendering (code):

- `content/`: **the only directory that changes week to week.**
  - `config.json`: course/semester/instructor/TA info and external links.
    `semester.weekOneMonday` anchors all week-number math.
  - `schedule.json`: `lectures`, `recitations`, `homeworks`, `exams` arrays.
  - `announcements.json`: `{date, title, body, pinned?}` list.
  - `staff.json`: `instructor`/`headTas`/`tas` arrays of
    `{name, email?, major?, year?, photo?, linkedin?, website?, calendly?, bio?}`. Headshots live in
    `public/headshots/` (checked into the repo; no external storage) and
    `photo` is their public path, e.g. `/headshots/jane-doe.jpg`.
  - `course-info/*.md`: long-form pages (syllabus, grading, policies) with
    `title`/`description` frontmatter.
- `lib/content.ts`: typed getters over the JSON (`getConfig`,
  `getSchedule`, `getAnnouncements`) plus week math (`getWeekNumber`,
  `getCurrentWeek`). The exported types are the de facto schema for the
  JSON files; keep them in sync.
- `lib/markdown.ts`: `getMarkdownPage(dir, slug)` reads
  `content/<dir>/<slug>.md` at build time (server-only, uses `fs`).
- `app/`: routes. `layout.tsx` sets metadata from config and injects an
  inline pre-hydration script that applies the dark class from
  localStorage (prevents light-mode flash).
- `components/`: UI. Server components except `Shell.tsx` (sidebar
  state, mobile drawer, Cmd/Ctrl+B shortcut) and `ThemeToggle.tsx`,
  which are `"use client"`.

## Conventions & gotchas

- **No em dashes anywhere** (content, UI copy, code comments, docs).
  Use a colon, semicolon, comma, parentheses, or "by"/"to" instead.
  En dashes are allowed for ranges (e.g. 1:45–3:14pm) and as the empty
  table-cell placeholder in `ScheduleTable`.
- Dates in content files are ISO `YYYY-MM-DD` strings; sorting relies on
  lexicographic comparison, so keep that format.
- Content edits go in `content/` only; do not hardcode course facts
  (names, dates, links) in components.
- `getCurrentWeek()` uses `new Date()` and is evaluated at build time, so
  the highlighted "current week" goes stale between deploys. Fix planned
  (ISR revalidate or client-side computation).
- Dark mode is class-based Tailwind (`dark:` variants); every new
  component needs both light and dark styles.
- Many links in `config.json`/`schedule.json` are `"#"` placeholders
  until the semester starts.

## Branches & deployment

- `main`: active development.
- `coming-soon`: minimal "coming soon" landing page. cis5200.com serves
  this branch on Vercel until the real content is confirmed; do not
  merge it into `main`.

## Roadmap

- Fill in real Ed/Canvas/Gradescope/slides links before Aug 24 (week 1).
- Confirm the tentative Fall 2026 schedule dates with Prof. Gardner.
- Point cis5200.com back at `main` once content is verified.
- Add a git-based CMS (likely Keystatic) later so TAs can edit `content/`
  through a UI; no architectural changes expected.
