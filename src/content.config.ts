import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { isCalendarDate, validateSlug } from "./lib/publication.mjs";

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => {
      const match = entry.match(/^([^/]+)\/index\.md$/);
      if (!match) throw new Error(`Article must be <slug>/index.md: ${entry}`);
      return validateSlug(match[1]);
    },
  }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1).max(300).optional(),
    date: z
      .string()
      .refine(isCalendarDate, "Expected real YYYY-MM-DD calendar date"),
    updated: z
      .string()
      .refine(isCalendarDate, "Expected real YYYY-MM-DD calendar date")
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
