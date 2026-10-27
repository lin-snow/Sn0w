import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";

// Wrap `:::gallery` blocks in a grid while keeping their child image nodes in
// the Markdown AST, so Astro still hashes, sizes, and lazy-loads every image.
const gallery = {
  name: "sn0w-gallery",
  containerDirective(node, ctx) {
    if (node.name !== "gallery") return;
    const children = [];
    for (const child of node.children) {
      if (child.type === "paragraph") {
        const images = child.children.filter((part) => part.type === "image");
        const rest = child.children.filter(
          (part) =>
            part.type !== "image" &&
            !(part.type === "text" && part.value.trim() === "") &&
            part.type !== "break",
        );
        if (images.length > 0 && rest.length === 0) {
          for (const image of images) {
            children.push({ type: "paragraph", children: [image] });
          }
          continue;
        }
      }
      children.push(child);
    }
    ctx.replaceNode(node, {
      type: "sn0w-gallery",
      children,
      data: {
        hName: "div",
        hProperties: { className: ["gallery"] },
      },
    });
  },
};

// Canonical URLs use the production origin by default; SITE_URL overrides it
// (for example a preview deployment or a domain move).
const site = process.env.SITE_URL ?? "https://sn0w.fyi/";
if (
  !/^https?:$/.test(new URL(site).protocol) ||
  new URL(site).username ||
  new URL(site).password
) {
  throw new Error(
    "SITE_URL must be an absolute HTTP(S) URL without credentials",
  );
}

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  site,
  markdown: {
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [gallery],
    }),
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
    },
  },
  image: { service: { entrypoint: "astro/assets/services/noop" } },
});
