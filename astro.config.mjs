import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

export default defineConfig({
  site: "https://uxbyjoao.me",
  output: "server",
  prefetch: true,
  integrations: [
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
      filter: (page) => !page.includes("/portfolio"),
    }),
    robotsTxt(),
    mdx(),
    icon({
      include: {
        tabler: ["*"],
      },
    }),
  ],
  adapter: vercel(),
});
