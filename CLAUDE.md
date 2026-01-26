# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Architecture

This is a personal portfolio website built with Astro 5.x, Tailwind CSS, and deployed to Vercel with server-side rendering.

### Key Files

- `src/data/data.ts` - Centralized data for experience, education, and social media (typed interfaces)
- `src/content/config.ts` - Astro content collection schemas for blog and portfolio
- `src/layouts/BaseLayout.astro` - Main layout wrapper used by all pages
- `src/middleware.ts` - Authentication middleware for portfolio protection

### Component Organization

- `src/components/shell/` - Site-wide UI (Navbar, Footer, MobileNav, MetaHead)
- `src/components/home/` - Homepage sections (Hero, Experience, Education, SkillsList)

### Content Collections

- **Blog**: `src/content/blog/` - MDX files organized by year/month (prerendered)
- **Portfolio**: `src/content/portfolio/` - MDX project files (server-rendered, password-protected)

### Portfolio Authentication

The `/portfolio` routes are protected by middleware in `src/middleware.ts`. Authentication flow:
- Unauthenticated users are redirected to `/portfolio/login`
- Password is validated against `PORTFOLIO_PASSWORD` env var
- Session stored in `portfolio_auth` cookie (2-hour expiry, httpOnly)
- Logout endpoint: `POST /portfolio/logout`

### Environment Variables

- `PORTFOLIO_PASSWORD` - Password for portfolio access (required in production)

### Path Aliases (tsconfig.json)

- `@layouts/*` → `src/layouts/*`
- `@components/*` → `src/components/*`
- `@data` → `src/data/data`
