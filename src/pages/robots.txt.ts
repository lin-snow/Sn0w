import type { APIRoute } from "astro";
import { absoluteUrl } from "../lib/urls";

export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];
  if (site) {
    lines.push(
      "",
      "# Machine-readable site index for language models",
      `# LLM index: ${absoluteUrl(site, "llms.txt")}`,
      "",
      `Sitemap: ${absoluteUrl(site, "sitemap.xml")}`,
    );
  }
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
