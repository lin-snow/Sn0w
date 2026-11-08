import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config";
import { excerpt } from "../lib/excerpt.mjs";
import { absoluteUrl } from "../lib/urls";
import { selectPublished } from "../lib/publication.mjs";

export const GET: APIRoute = async ({ site: configured }) => {
  const url = (path: string) => absoluteUrl(configured, path);
  const posts = selectPublished(await getCollection("posts"));
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "L1nSn0w is a software engineering student at GDUT and a former backend intern at LangGenius. This site collects technical notes, life logs, and project write-ups.",
    "",
    "Language: Simplified Chinese (zh-CN), with English technical terms.",
    "",
    "## Pages",
    `- [Home](${url("/")}): personal introduction, experience, and projects.`,
    `- [About](${url("about/")}): background and interests.`,
    `- [Projects](${url("projects/")}): open-source work.`,
    `- [Blog](${url("blog/")}): every published article, grouped by year.`,
    "",
    "## Posts",
    ...posts.map((post) => {
      const summary = (post.data.description ?? excerpt(post.body, 140))
        .replace(/\s+/g, " ")
        .trim();
      return `- [${post.data.title}](${url(`blog/${post.id}/`)}) — ${post.data.date} — ${summary} ([Markdown](${url(`blog/${post.id}.md`)}))`;
    }),
    "",
    "## Feeds",
    `- [RSS](${url("rss.xml")}): full-text feed.`,
    `- [Full text](${url("llms-full.txt")}): every article as raw Markdown.`,
    "",
    "## Contact",
    `- Email: ${site.email.href.replace(/^mailto:/, "")}`,
    ...site.social.map((item) => `- ${item.label}: ${item.href}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
