import PageHeader from "@/components/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownPage } from "@/lib/markdown";

export const metadata = { title: "External Resources" };

export default function ExternalResourcesPage() {
  const { title, description, contentHtml } = getMarkdownPage(
    "resources",
    "external-resources"
  );
  return (
    <>
      <PageHeader eyebrow="Resources" title={title} description={description} />
      <MarkdownContent html={contentHtml} />
    </>
  );
}
