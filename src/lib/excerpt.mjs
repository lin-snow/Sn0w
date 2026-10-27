const stripMarkdown = (markdown) =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Plain-text fallback for posts that do not declare a description. */
export function excerpt(markdown, limit = 150) {
  const text = stripMarkdown(markdown);
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}
