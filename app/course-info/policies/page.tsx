import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "Policies" };

export default function PoliciesPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "course-info",
    "policies"
  );
  return (
    <>
      <PageHeader eyebrow="Course Info" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
