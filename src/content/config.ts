import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
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
