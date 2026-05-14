export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-penn-red-600 dark:text-penn-red-400">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-penn-blue-600 sm:text-4xl dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {description}
        </p>
      )}
    </header>
  );
}
