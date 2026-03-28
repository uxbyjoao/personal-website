import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
    // Preserve path-based IDs to match old slug behavior (e.g. "2022/09/adobe-vs-figma")
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    lead: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean(),
  }),
});

export const collections = {
  blog: blogCollection,
};
