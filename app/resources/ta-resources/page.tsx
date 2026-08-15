import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "TA Resources" };

export default function TaResourcesPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "resources",
    "ta-resources"
  );
  return (
    <>
      <PageHeader eyebrow="Resources" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
