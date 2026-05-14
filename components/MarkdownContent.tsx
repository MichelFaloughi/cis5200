export default function MarkdownContent({ html }: { html: string }) {
  return (
    <div
      className="
        prose prose-neutral max-w-none
        prose-headings:font-semibold prose-headings:text-penn-blue-600
        prose-a:text-penn-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-neutral-900
        prose-table:text-sm prose-th:font-semibold prose-th:text-neutral-600
        prose-td:text-neutral-700
        dark:prose-invert
        dark:prose-headings:text-white
        dark:prose-a:text-penn-blue-300
        dark:prose-strong:text-neutral-100
        dark:prose-th:text-neutral-300
        dark:prose-td:text-neutral-400
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
