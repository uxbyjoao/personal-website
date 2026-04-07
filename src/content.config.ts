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

const portfolioCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/portfolio",
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    role: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    lead: z.string(),
    thumbnail: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageMobile: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean(),
  }),
});

export const collections = {
  blog: blogCollection,
  portfolio: portfolioCollection,
};
