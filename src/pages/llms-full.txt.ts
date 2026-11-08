import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config";
import { rewriteMarkdownImages } from "../lib/markdown";
import { absoluteUrl } from "../lib/urls";
import { selectPublished } from "../lib/publication.mjs";

export const GET: APIRoute = async ({ site: configured }) => {
  const url = (path: string) => absoluteUrl(configured, path);
  const posts = selectPublished(await getCollection("posts"));
  const sections = await Promise.all(
    posts.map(async (post) => {
      const updated =
        post.data.updated && post.data.updated !== post.data.date
          ? `\nUpdated: ${post.data.updated}`
          : "";
      const body = await rewriteMarkdownImages(
        (post.body ?? "").trim(),
        post.id,
        configured,
      );
      return `## ${post.data.title}

URL: ${url(`blog/${post.id}/`)}
Markdown: ${url(`blog/${post.id}.md`)}
Published: ${post.data.date}${updated}

${body}`;
    }),
  );
  const text = `# ${site.name} — Full content

> ${site.description}

This file contains the full text of every published article, in reverse chronological order, for language models and offline readers. Most posts are written in Simplified Chinese (zh-CN) with English technical terms. The canonical HTML version of each article is linked above its text.

${sections.join("\n\n---\n\n")}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
