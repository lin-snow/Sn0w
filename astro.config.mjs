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
            children.push({
              type: "paragraph",
              children: [
                {
                  ...image,
                  data: {
                    ...image.data,
                    hProperties: {
                      ...image.data?.hProperties,
                      sizes:
                        "(min-width: 60ch) calc(30ch - 6px), calc(50vw - 22px)",
                    },
                  },
                },
              ],
            });
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

// Markdown images cannot take a `sizes` prop, and Astro's default `100vw`
// makes a wide desktop ask for the full-resolution original. The column is
// `.shell`'s 60ch inside 16px of page padding, so state that instead.
const imageSizes = {
  name: "sn0w-image-sizes",
  image(node, ctx) {
    const sizes =
      node.data?.hProperties?.sizes ??
      "(min-width: 60ch) 60ch, calc(100vw - 32px)";
    ctx.setProperty(node, "data", {
      ...node.data,
      hProperties: {
        ...node.data?.hProperties,
        sizes,
      },
    });
  },
};

// Shiki themes pick token colours for their own background. On the site's
// light code surface (`--pre-bg` #f7f7f7) a few of them land under WCAG AA
// (4.5:1). Darken just those tokens towards black — the palette otherwise
// stays exactly as the theme author drew it.
const CODE_BG_LIGHT = "#f7f7f7";
const srgb = (hex) =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (value) =>
  value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
const luminance = (rgb) =>
  0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};
const toHex = (rgb) =>
  `#${rgb
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
const readableOn = (hex, background, minimum = 4.5) => {
  const rgb = srgb(hex);
  const bg = srgb(background);
  if (contrast(rgb, bg) >= minimum) return hex;
  let low = 0;
  let high = 1;
  for (let step = 0; step < 12; step++) {
    const mid = (low + high) / 2;
    if (
      contrast(
        rgb.map((c) => c * mid),
        bg,
      ) >= minimum
    )
      low = mid;
    else high = mid;
  }
  return toHex(rgb.map((c) => c * low));
};
const codeContrast = {
  name: "sn0w-code-contrast",
  tokens(lines) {
    for (const line of lines) {
      for (const token of line) {
        const style = token.htmlStyle;
        const light = style?.["--shiki-light"];
        if (typeof light === "string" && /^#[0-9a-f]{6}$/i.test(light)) {
          style["--shiki-light"] = readableOn(light, CODE_BG_LIGHT);
        }
      }
    }
  },
};

// Canonical URLs use the production origin by default; SITE_URL overrides it
// (for example a preview deployment or a domain move).
const site = process.env.SITE_URL ?? "https://sn0w.fyi/";
const siteUrl = URL.parse(site);
if (
  !siteUrl ||
  !/^https?:$/.test(siteUrl.protocol) ||
  siteUrl.username ||
  siteUrl.password
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
      mdastPlugins: [gallery, imageSizes],
    }),
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
      transformers: [codeContrast],
    },
  },
  // Sharp at build time: every Markdown image becomes a srcset capped at 1280w
  // instead of shipping the original 4000px screenshot. `constrained` keeps
  // small images at their natural size; `full-width` would upscale them.
  image: {
    layout: "constrained",
    breakpoints: [480, 640, 960, 1280],
    responsiveStyles: true,
  },
  // Hover-prefetch internal links: no client router, just a warmer next page.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
});
