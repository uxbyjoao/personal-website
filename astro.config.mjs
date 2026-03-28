import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://uxbyjoao.me",
  output: "static",
  prefetch: true,
  integrations: [
    sitemap({ changefreq: "weekly", priority: 0.7, lastmod: new Date(), entryLimit: 10000 }),
    robotsTxt(),
    mdx(),
  ],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
