import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean(),
  }),
});

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    description: z.string(),
    featured: z.boolean().optional(),
    datePublished: z.string().transform((date) => new Date(date)),
    tags: z.array(z.string()).optional(),
    roles: z.array(z.string()),
    draft: z.boolean(),
  }),
});

export const collections = {
  blog: blogCollection,
};
