import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "Syllabus" };

export default function SyllabusPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "course-info",
    "syllabus"
  );
  return (
    <>
      <PageHeader eyebrow="Course Info" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
