import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { rewriteMarkdownImages } from "../../lib/markdown";
import { currentUrl } from "../../lib/urls";
import { selectPublished } from "../../lib/publication.mjs";

export const getStaticPaths = (async () => {
  const posts = selectPublished(await getCollection("posts"));
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site }) => {
  const { post } = props as { post: CollectionEntry<"posts"> };
  const pageUrl = currentUrl(site, `/blog/${post.id}/`);
  const updated =
    post.data.updated && post.data.updated !== post.data.date
      ? ` · Updated ${post.data.updated}`
      : "";
  const body = await rewriteMarkdownImages(
    (post.body ?? "").trim(),
    post.id,
    site,
  );
  const markdown = `# ${post.data.title}

> Published ${post.data.date}${updated} · ${pageUrl}

${body}
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${pageUrl}>; rel="canonical"`,
    },
  });
};
