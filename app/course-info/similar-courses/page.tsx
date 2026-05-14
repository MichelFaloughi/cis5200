import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "Similar Courses at Penn" };

export default function SimilarCoursesPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "course-info",
    "similar-courses"
  );
  return (
    <>
      <PageHeader eyebrow="Course Info" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
