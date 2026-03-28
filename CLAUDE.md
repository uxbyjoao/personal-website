# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Astro dev server
- `npm run build` — Production build (outputs static HTML to `dist/`)
- `npm run preview` — Preview production build locally
- `npx prettier --write .` — Format code (Prettier with Tailwind plugin)

No test framework is configured.

## Architecture

Astro 6 personal portfolio site for João Gomes (UX Designer), deployed on **Vercel**. Output mode is `static` (all pages pre-rendered by default); individual routes can opt into SSR via `export const prerender = false`. Uses `@astrojs/vercel` adapter.

### Routing & Pages

- `src/pages/index.astro` — Home page
- `src/pages/experience.astro` — Full CV page
- `src/pages/blog/index.astro` — Blog listing
- `src/pages/blog/[...path].astro` — Dynamic blog post route
- `src/pages/portfolio/` — Password-protected portfolio case studies (SSR, `prerender = false`)
- `src/pages/contact.astro` — Contact form (server-rendered, sends email via Resend)

### Content Layer API

Blog posts live in `src/content/blog/` as MDX files. Config at `src/content.config.ts` (note: root-level, not inside `src/content/`) using the Content Layer API with `glob()` loaders. Schema defined with Zod.

### Data Layer

All structured resume data (experience, education, social links) lives in `src/data/data.ts` with TypeScript interfaces. The `key: boolean` field on Experience entries controls which items appear on the home page vs. the full experience page.

### Layout & Components

- `src/layouts/BaseLayout.astro` — Wraps all pages: MetaHead + Navbar + MobileNav + Footer
- `src/components/shell/` — Global chrome (nav, footer, SEO meta, logo)
- `src/components/home/` — Home page sections (Hero, Experience, Education, SkillsList)

### Path Aliases (tsconfig)

- `@layouts/*` → `src/layouts/*`
- `@components/*` → `src/components/*`
- `@data` → `src/data/data.ts`

### Styling

**Tailwind CSS v4** via `@tailwindcss/vite` plugin (not `@astrojs/tailwind`). Configuration in `tailwind.config.cjs` maps Tailwind tokens to CSS custom properties. Design tokens (colors, spacing, typography) are defined as CSS custom properties in `src/styles/style.css`. Custom font (Inter) loaded via `src/styles/fonts.css`. Dark mode uses `data-theme="dark"` attribute on `<html>`, toggled in Navbar and persisted to localStorage.

### Auth & Middleware

Portfolio case studies are password-protected via `src/middleware.ts`. Auth uses a signed cookie (`portfolio_auth`). Requires `PORTFOLIO_PASSWORD` env var.

### Key Integrations

- `@astrojs/mdx` — Blog content
- `@astrojs/vercel` — Vercel adapter
- `@astrojs/sitemap` — Auto-generated sitemap
- `astro-icon` — SVG icons (Tabler icon set)
- `animejs` — Mobile nav drawer animations (`src/scripts/mobileNav.ts`)
- `@vercel/analytics` — Client-side analytics

### Environment Variables

Not committed. Required vars:

- `PORTFOLIO_PASSWORD` — Password for protected portfolio routes
- `RESEND_API_KEY` — Resend API key for contact form emails
- `CONTACT_EMAIL` — Recipient address for contact form (falls back to `console.log` in dev)

## Workflow

- Always use `/frontend-design` for all design-related tasks in this project.
