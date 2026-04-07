import { z, defineCollection } from "astro:content";

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    private: z.boolean(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
