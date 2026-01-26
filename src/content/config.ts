import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
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
  type: "content",
  schema: z.object({
    title: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    private: z.boolean(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean(),
    lead: z.string().optional(),
    thumbnail: z.string().optional(),
    client: z.string().optional(),
    role: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  portfolio: portfolioCollection,
};
