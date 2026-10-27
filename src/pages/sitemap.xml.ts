import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { sitePath } from "../lib/paths";
import { selectPublished } from "../lib/publication.mjs";

export const GET: APIRoute = async ({ site }) => {
  const posts = selectPublished(await getCollection("posts"));
  const entries: { path: string; lastmod?: string }[] = [
    { path: "/" },
    { path: "blog/" },
    { path: "about/" },
    { path: "projects/" },
    ...posts.map((post) => ({
      path: `blog/${post.id}/`,
      lastmod: post.data.updated ?? post.data.date,
    })),
  ];
  const urls = site
    ? entries.map(({ path, lastmod }) => {
        const loc = new URL(sitePath(path), site).href.replace(
          /[&<>"']/g,
          (char) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&apos;",
            })[char]!,
        );
        return `  <url>
    <loc>${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`;
      })
    : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
