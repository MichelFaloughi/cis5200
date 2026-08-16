import { getConfig } from "@/lib/content";

export default function ComingSoonPage() {
  const config = getConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-neutral-950">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-penn-red-600 dark:text-penn-red-400">
        University of Pennsylvania · {config.semester.label}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-penn-blue-600 sm:text-5xl dark:text-white">
        {config.course.code}: {config.course.title}
      </h1>
      <p className="mt-6 max-w-md text-base text-neutral-600 dark:text-neutral-400">
        The course website is being built and will be live before the
        semester starts. Check back soon!
      </p>
      {/* <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-500">
        Questions? Write to the course staff at{" "}
        <a
          href="mailto:cis5200-staff@engineering.upenn.edu"
          className="font-medium text-penn-blue-600 underline-offset-2 hover:underline dark:text-penn-blue-300"
        >
          cis5200-staff@engineering.upenn.edu
        </a>
      </p> */}
    </main>
  );
}
