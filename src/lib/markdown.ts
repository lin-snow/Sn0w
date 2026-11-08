import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

const images = import.meta.glob<ImageMetadata>(
  "/src/content/posts/**/*.{png,jpg,jpeg,webp,gif}",
  { eager: true, import: "default" },
);

const IMAGE_LINK = /\]\(\.\/([^)\s]+)\)/g;

/**
 * Rewrite `./image.webp` links in a post body to the processed 1280w asset so
 * the Markdown mirror and the LLM corpus stay usable outside the page.
 */
export async function rewriteMarkdownImages(
  body: string,
  id: string,
  site: URL | undefined,
) {
  const urls = new Map<string, string>();
  for (const [, file] of body.matchAll(IMAGE_LINK)) {
    const image = images[`/src/content/posts/${id}/${file}`];
    if (!image) continue;
    const { src } = await getImage({ src: image, width: 1280 });
    urls.set(file, site ? new URL(src, site).href : src);
  }
  return body.replace(IMAGE_LINK, (match, file: string) => {
    const url = urls.get(file);
    return url ? `](${url})` : match;
  });
}
