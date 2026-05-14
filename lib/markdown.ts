import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type MarkdownPage = {
  title: string;
  description?: string;
  contentHtml: string;
};

export function getMarkdownPage(dir: string, slug: string): MarkdownPage {
  const filePath = path.join(process.cwd(), "content", dir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const contentHtml = marked.parse(content) as string;
  return {
    title: data.title ?? slug,
    description: data.description,
    contentHtml,
  };
}
