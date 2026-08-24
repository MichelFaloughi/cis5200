import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "Assessments" };

export default function AssessmentsPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "course-info",
    "assessments"
  );
  return (
    <>
      <PageHeader eyebrow="Course Info" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
