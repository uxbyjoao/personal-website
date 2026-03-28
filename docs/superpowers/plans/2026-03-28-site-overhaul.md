# Site Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Use `/frontend-design` for all design-related tasks.

**Goal:** Upgrade to Astro 4.x, implement a complete design overhaul (Outfit + JetBrains Mono, neon lime accent, dark-first), and add a password-protected portfolio section.

**Architecture:** Astro 4.x with hybrid output (static default, SSR opt-in for portfolio auth). Design system via CSS custom properties + Tailwind. Portfolio auth via middleware + cookie-based sessions. Email delivery via serverless API route.

**Tech Stack:** Astro 4.x, Tailwind CSS, @tailwindcss/typography, Vercel serverless, MDX

**Spec:** `docs/superpowers/specs/2026-03-28-site-overhaul-design.md`

---

## Task 1: Dependency Upgrade

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Delete: `src/scripts/mobileNav.ts`

- [ ] **Step 1: Remove deprecated packages and animejs**

```bash
npm uninstall @astrojs/image @astrojs/prefetch animejs astro-icon
```

- [ ] **Step 2: Upgrade Astro and all integrations**

```bash
npm install astro@latest @astrojs/vercel@latest @astrojs/mdx@latest @astrojs/tailwind@latest @astrojs/sitemap@latest @tailwindcss/typography@latest astro-robots-txt@latest @vercel/analytics@latest
```

- [ ] **Step 3: Upgrade dev dependencies**

```bash
npm install -D prettier@latest prettier-plugin-tailwindcss@latest
```

- [ ] **Step 4: Update astro.config.mjs**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://uxbyjoao.me",
  output: "hybrid",
  prefetch: true,
  integrations: [
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
    }),
    robotsTxt(),
    mdx(),
  ],
  adapter: vercel(),
});
```

- [ ] **Step 5: Delete mobileNav.ts**

Delete `src/scripts/mobileNav.ts` — mobile nav will use CSS transitions instead.

- [ ] **Step 6: Remove prerender exports from all pages**

In `src/pages/index.astro`, `src/pages/experience.astro`, `src/pages/blog/index.astro`, and `src/pages/blog/[...path].astro`: remove `export const prerender = true;` — hybrid mode makes static the default.

- [ ] **Step 7: Fix BlogImage.astro import**

In `src/components/shell/BlogImage.astro`, replace:
```astro
import { Image } from "@astrojs/image/components";
```
with:
```astro
import { Image } from "astro:assets";
```

- [ ] **Step 8: Remove all astro-icon imports**

In every file that imports from `astro-icon` (`Navbar.astro`, `MobileNav.astro`, `MobileNavLink.astro`, `NavbarLink.astro`, `SocialMedia.astro`, `ButtonLink.astro`): remove the `import { Icon } from "astro-icon"` line and replace `<Icon>` usages with inline SVG or temporary placeholder text. These components will be fully rewritten in later tasks.

- [ ] **Step 9: Verify build**

```bash
npm run build
```

Fix any remaining build errors. The site may look broken visually — that's expected since we're about to redesign everything.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: upgrade to Astro 4.x, remove deprecated packages"
```

---

## Task 2: Design Tokens + Font Loading

**Files:**
- Rewrite: `src/styles/style.css`
- Rewrite: `src/styles/fonts.css`
- Rewrite: `tailwind.config.cjs`

- [ ] **Step 1: Rewrite fonts.css**

Replace `src/styles/fonts.css` with Google Fonts imports for Outfit and JetBrains Mono:

```css
/* Outfit — Display/Heading font */
@font-face {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4a0Ew.woff2") format("woff2");
}
@font-face {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4a0Ew.woff2") format("woff2");
}
@font-face {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1149kEw.woff2") format("woff2");
}
@font-face {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C49kEw.woff2") format("woff2");
}

/* JetBrains Mono — Body/Code font */
@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2") format("woff2");
}
@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2") format("woff2");
}
```

Note: For production, self-host these font files in `public/assets/fonts/` and update the src URLs. During development, Google Fonts URLs are fine.

- [ ] **Step 2: Rewrite style.css with design tokens**

Replace `src/styles/style.css` with:

```css
@import "./fonts.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Dark mode (default) */
  :root {
    --bg: #050505;
    --surface: #0a0a0a;
    --surface-elevated: #111111;
    --border: rgba(255, 255, 255, 0.06);
    --border-subtle: rgba(255, 255, 255, 0.04);
    --text-primary: #ffffff;
    --text-secondary: #999999;
    --text-muted: #555555;
    --accent: #a3e635;
    --accent-hover: #bef264;
    --accent-surface: rgba(163, 230, 53, 0.08);
    --accent-on: #050505;
  }

  /* Light mode */
  [data-theme="light"] {
    --bg: #fafafa;
    --surface: #ffffff;
    --surface-elevated: #f5f5f5;
    --border: rgba(0, 0, 0, 0.08);
    --border-subtle: rgba(0, 0, 0, 0.04);
    --text-primary: #0a0a0a;
    --text-secondary: #555555;
    --text-muted: #999999;
    --accent: #65a30d;
    --accent-hover: #4d7c0f;
    --accent-surface: rgba(101, 163, 13, 0.08);
    --accent-on: #ffffff;
  }

  html {
    background-color: var(--bg);
    color: var(--text-secondary);
  }

  body {
    font-family: "JetBrains Mono", monospace;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.85;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Outfit", sans-serif;
    color: var(--text-primary);
  }

  /* Scroll reveal animation */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-up {
    animation: fadeUp 0.4s ease-out both;
  }

  /* Shake animation for password error */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  .shake {
    animation: shake 0.3s ease-in-out;
  }
}
```

- [ ] **Step 3: Update tailwind.config.cjs**

Replace `tailwind.config.cjs` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-surface": "var(--accent-surface)",
        "accent-on": "var(--accent-on)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--text-secondary)",
            "--tw-prose-headings": "var(--text-primary)",
            "--tw-prose-links": "var(--accent)",
            "--tw-prose-code": "var(--text-primary)",
            "--tw-prose-pre-bg": "var(--surface)",
            "--tw-prose-pre-code": "var(--text-secondary)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--text-secondary)",
            "--tw-prose-quote-borders": "var(--accent)",
            h1: { fontFamily: '"Outfit", sans-serif', fontWeight: "800" },
            h2: { fontFamily: '"Outfit", sans-serif', fontWeight: "800" },
            h3: { fontFamily: '"Outfit", sans-serif', fontWeight: "600" },
            code: { fontFamily: '"JetBrains Mono", monospace' },
            a: { textDecoration: "none", borderBottom: "1px solid var(--accent)" },
            "a:hover": { color: "var(--accent-hover)" },
            img: { borderRadius: "8px" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/ tailwind.config.cjs
git commit -m "feat: design system tokens, new typography, color palette"
```

---

## Task 3: Base Layout + Navigation

**Files:**
- Rewrite: `src/layouts/BaseLayout.astro`
- Rewrite: `src/components/shell/Navbar.astro`
- Rewrite: `src/components/shell/MetaHead.astro`
- Rewrite: `src/components/shell/Footer.astro`
- Delete: `src/components/shell/MobileNav.astro`
- Delete: `src/components/shell/MobileNavLink.astro`
- Delete: `src/components/shell/NavbarLink.astro`
- Delete: `src/components/shell/Logo.astro`
- Delete: `src/components/shell/SocialMedia.astro`
- Modify: `src/scripts/analytics.js`

- [ ] **Step 1: Rewrite MetaHead.astro**

Replace `src/components/shell/MetaHead.astro` with updated meta tags, preloading Outfit and JetBrains Mono instead of Inter:

```astro
---
type Props = {
  title?: string;
  description?: string;
  ogImageUrl?: string;
};

const BASE_URL = "https://uxbyjoao.me/";
const {
  title = "João Gomes — Senior UX Designer",
  description = "Senior UX Designer based in Berlin. Design systems, e-commerce, and the space between design and code.",
  ogImageUrl = "/assets/images/profile.png",
} = Astro.props;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<meta name="generator" content={Astro.generator} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={`${BASE_URL}${ogImageUrl}`} />
<meta property="og:url" content={BASE_URL} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={`${BASE_URL}${ogImageUrl}`} />

<!-- Favicons -->
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />

<!-- Theme color -->
<meta name="theme-color" content="#050505" />
```

- [ ] **Step 2: Rewrite Navbar.astro**

Replace `src/components/shell/Navbar.astro`. This new version includes the mobile menu as a full-screen overlay (no separate MobileNav component), a theme toggle, and the Portfolio CTA:

```astro
---
const currentPath = Astro.url.pathname;

function isActive(href: string): boolean {
  if (href === "/") return currentPath === "/";
  return currentPath.startsWith(href);
}

const navLinks = [
  { href: "/", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
];
---

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-b-[var(--border-subtle)]" style="background: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(20px);">
  <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
    <!-- Logo -->
    <a href="/" class="font-display text-base font-extrabold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-200">
      JG
    </a>

    <!-- Desktop nav -->
    <div class="hidden items-center gap-6 md:flex">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class:list={[
            "font-mono text-[11px] uppercase tracking-[2px] transition-colors duration-200",
            isActive(href) ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
          ]}
        >
          {label}
        </a>
      ))}
      <a
        href="/portfolio"
        class="font-display text-[11px] font-extrabold uppercase tracking-[1.5px] bg-[var(--accent)] text-[var(--accent-on)] px-3.5 py-1.5 rounded transition-colors duration-200 hover:bg-[var(--accent-hover)]"
      >
        Portfolio
      </a>
      <button
        id="theme-toggle"
        class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 p-1"
        aria-label="Toggle theme"
      >
        <svg id="icon-sun" class="hidden h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <svg id="icon-moon" class="hidden h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      id="mobile-menu-btn"
      class="md:hidden text-[var(--text-primary)] p-1"
      aria-label="Open menu"
    >
      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
</nav>

<!-- Mobile overlay menu -->
<div id="mobile-menu" class="fixed inset-0 z-[60] hidden flex-col items-center justify-center gap-8" style="background: var(--bg);">
  <button id="mobile-menu-close" class="absolute top-5 right-6 text-[var(--text-primary)] p-1" aria-label="Close menu">
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"/></svg>
  </button>
  {navLinks.map(({ href, label }) => (
    <a
      href={href}
      class:list={[
        "font-mono text-sm uppercase tracking-[3px] transition-colors duration-200",
        isActive(href) ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
      ]}
    >
      {label}
    </a>
  ))}
  <a
    href="/portfolio"
    class="font-display text-sm font-extrabold uppercase tracking-[2px] bg-[var(--accent)] text-[var(--accent-on)] px-6 py-2.5 rounded transition-colors duration-200 hover:bg-[var(--accent-hover)]"
  >
    Portfolio
  </a>
  <button
    id="mobile-theme-toggle"
    class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 mt-4"
    aria-label="Toggle theme"
  >
    Toggle theme
  </button>
</div>

<script is:inline>
  // Theme toggle
  function getTheme() {
    return localStorage.getItem("theme") || "dark";
  }
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const sun = document.getElementById("icon-sun");
    const moon = document.getElementById("icon-moon");
    if (sun && moon) {
      sun.classList.toggle("hidden", theme !== "dark");
      moon.classList.toggle("hidden", theme !== "light");
    }
  }
  applyTheme(getTheme());

  document.addEventListener("DOMContentLoaded", () => {
    function toggleTheme() {
      const next = getTheme() === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
    }
    document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
    document.getElementById("mobile-theme-toggle")?.addEventListener("click", toggleTheme);

    // Mobile menu
    const menu = document.getElementById("mobile-menu");
    document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
      menu?.classList.remove("hidden");
      menu?.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
    document.getElementById("mobile-menu-close")?.addEventListener("click", () => {
      menu?.classList.add("hidden");
      menu?.classList.remove("flex");
      document.body.style.overflow = "";
    });
  });
</script>
```

- [ ] **Step 3: Rewrite Footer.astro**

Replace `src/components/shell/Footer.astro`:

```astro
---
const year = new Date().getFullYear();

const socials = [
  { name: "GitHub", url: "https://github.com/uxbyjoao", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
  { name: "Behance", url: "https://www.behance.net/uxbyjoao", icon: "M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zM9 15.023H5V20h3.5c1.757 0 3.5-.672 3.5-2.57 0-1.927-1.408-2.407-3-2.407zm-4-4.977h3.5c1.302 0 2.5-.467 2.5-1.932C11 6.727 9.886 6.5 8.5 6.5H5v3.546zM2 4h7.643C12.071 4 14 5.057 14 7.571c0 1.553-.906 2.571-2.286 3.143C13.357 11.143 14.5 12.214 14.5 14.071 14.5 16.786 12.286 18 9.643 18H2V4z" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/jlfgms/", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];
---

<footer class="border-t border-[var(--border-subtle)] mt-32">
  <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 py-20 sm:flex-row">
    <p class="font-display text-sm font-semibold text-[var(--text-muted)]">
      João Gomes &copy; {year}
    </p>
    <div class="flex items-center gap-5">
      {socials.map(({ name, url, icon }) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
          aria-label={name}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d={icon} /></svg>
        </a>
      ))}
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Rewrite BaseLayout.astro**

Replace `src/layouts/BaseLayout.astro`:

```astro
---
import Navbar from "@components/shell/Navbar.astro";
import Footer from "@components/shell/Footer.astro";
import MetaHead from "@components/shell/MetaHead.astro";

import "../styles/style.css";

type Props = {
  title?: string;
  description?: string;
  ogImageUrl?: string;
};

const { title, description, ogImageUrl } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <MetaHead title={title} description={description} ogImageUrl={ogImageUrl} />
  </head>
  <body class="bg-[var(--bg)] text-[var(--text-secondary)]">
    <Navbar />
    <main class="pt-16">
      <slot />
    </main>
    <Footer />
    <script>
      import { inject } from "@vercel/analytics";
      inject({ mode: import.meta.env.MODE === "production" ? "production" : "development" });
    </script>
  </body>
</html>

<script is:inline>
  // Apply theme immediately to prevent flash
  (function() {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  })();
</script>
```

- [ ] **Step 5: Delete unused shell components**

Delete these files — their functionality is now folded into Navbar.astro and Footer.astro:
- `src/components/shell/MobileNav.astro`
- `src/components/shell/MobileNavLink.astro`
- `src/components/shell/NavbarLink.astro`
- `src/components/shell/Logo.astro`
- `src/components/shell/SocialMedia.astro`
- `src/scripts/analytics.js` (analytics is now inline in BaseLayout)

- [ ] **Step 6: Verify build**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: new base layout, navbar, footer with design system tokens"
```

---

## Task 4: Home Page — Hero + Experience

**Files:**
- Rewrite: `src/pages/index.astro`
- Rewrite: `src/components/home/Hero.astro`
- Rewrite: `src/components/home/Experience.astro`
- Rewrite: `src/components/home/SkillsList.astro`
- Delete: `src/components/home/ListSection.astro`
- Delete: `src/components/ButtonLink.astro`

- [ ] **Step 1: Rewrite Hero.astro**

Replace `src/components/home/Hero.astro`:

```astro
---
---

<section class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
  <p class="font-mono text-[11px] uppercase tracking-[3px] text-[var(--text-muted)] mb-6">
    João Gomes — Berlin
  </p>
  <h1 class="font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)]">
    Senior UX Designer<br />crafting <span class="text-[var(--accent)]">digital clarity</span>
  </h1>
  <p class="mt-5 font-mono text-[13px] font-light text-[var(--text-muted)] max-w-[480px] leading-relaxed">
    Design systems, e-commerce, and the space between design and code.
  </p>
  <div class="mt-9 flex items-center gap-4">
    <a
      href="/portfolio"
      class="font-display text-xs font-extrabold uppercase tracking-[2px] bg-[var(--accent)] text-[var(--accent-on)] px-6 py-2.5 rounded transition-colors duration-200 hover:bg-[var(--accent-hover)]"
    >
      Explore Work
    </a>
    <a
      href="/experience"
      class="font-display text-xs font-extrabold uppercase tracking-[2px] text-[var(--text-primary)] border border-[rgba(255,255,255,0.15)] px-6 py-2.5 rounded transition-colors duration-200 hover:border-[var(--text-muted)]"
    >
      Experience
    </a>
  </div>
  <p class="absolute bottom-8 font-mono text-[11px] text-[var(--text-muted)]">
    Scroll to explore &darr;
  </p>
</section>
```

- [ ] **Step 2: Rewrite SkillsList.astro**

Replace `src/components/home/SkillsList.astro`:

```astro
---
type Props = {
  skills: string[];
};

const { skills } = Astro.props;
---

<div class="flex flex-wrap gap-1.5 mt-4">
  {skills.map((skill) => (
    <span class="font-mono text-[11px] text-[var(--text-secondary)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] px-3 py-1 rounded">
      {skill}
    </span>
  ))}
</div>
```

- [ ] **Step 3: Rewrite Experience.astro**

Replace `src/components/home/Experience.astro`:

```astro
---
import { experience } from "@data";
import SkillsList from "./SkillsList.astro";

type Props = {
  keyOnly?: boolean;
};

const { keyOnly = false } = Astro.props;
const entries = keyOnly ? experience.filter((e) => e.key) : experience;
---

<section class="mx-auto max-w-3xl px-6 py-24">
  <h2 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] mb-12">
    {keyOnly ? "Key Experience" : "Experience"}
  </h2>
  <div class="flex flex-col gap-4">
    {entries.map((entry) => (
      <article class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
            {entry.startDate} — {entry.endDate}
          </span>
          <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
            {entry.location}
          </span>
        </div>
        <h3 class="font-display text-[32px] font-extrabold text-[var(--text-primary)] mt-3">
          {entry.title}
        </h3>
        <p class="font-mono text-sm mt-1">
          <span class="text-[var(--accent)]">{entry.company}</span>
        </p>
        <ul class="mt-4 flex flex-col gap-2">
          {entry.description.map((desc) => (
            <li class="font-mono text-[13px] font-light text-[var(--text-secondary)] leading-relaxed">
              {desc}
            </li>
          ))}
        </ul>
        <SkillsList skills={entry.skills} />
      </article>
    ))}
  </div>
  {keyOnly && (
    <div class="mt-8 text-center">
      <a
        href="/experience"
        class="font-mono text-sm text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-hover)] transition-colors duration-200"
      >
        See full experience &rarr;
      </a>
    </div>
  )}
</section>
```

- [ ] **Step 4: Rewrite index.astro**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import Hero from "@components/home/Hero.astro";
import Experience from "@components/home/Experience.astro";
---

<BaseLayout>
  <Hero />
  <Experience keyOnly />
</BaseLayout>
```

- [ ] **Step 5: Delete unused components**

Delete:
- `src/components/home/ListSection.astro`
- `src/components/ButtonLink.astro`

- [ ] **Step 6: Run dev server and visually verify**

```bash
npm run dev
```

Check home page at `localhost:4321`. Verify: hero fills viewport, experience cards render below, dark mode toggle works, fonts load correctly.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: new home page with hero and experience cards"
```

---

## Task 5: Experience Page + Education

**Files:**
- Rewrite: `src/pages/experience.astro`
- Rewrite: `src/components/home/Education.astro`

- [ ] **Step 1: Rewrite Education.astro**

Replace `src/components/home/Education.astro`:

```astro
---
import { education } from "@data";
---

<section class="mx-auto max-w-3xl px-6 py-24">
  <h2 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] mb-12">
    Education
  </h2>
  <div class="flex flex-col gap-4">
    {education.map((entry) => (
      <article class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8">
        <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
          {entry.endDate}
        </span>
        <h3 class="font-display text-xl font-semibold text-[var(--text-primary)] mt-2">
          {entry.institution}
        </h3>
        <p class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mt-1">
          {entry.location}
        </p>
        {entry.description.map((desc) => (
          <p class="font-mono text-[13px] font-light text-[var(--text-secondary)] mt-3 leading-relaxed">
            {desc}
          </p>
        ))}
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Rewrite experience.astro page**

Replace `src/pages/experience.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import Experience from "@components/home/Experience.astro";
import Education from "@components/home/Education.astro";
---

<BaseLayout title="Experience — João Gomes">
  <div class="pt-24">
    <Experience />
    <Education />
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Check `/experience`. Verify all entries render, education section appears below.

```bash
git add -A
git commit -m "feat: new experience and education pages"
```

---

## Task 6: Blog Index + Blog Post Template

**Files:**
- Rewrite: `src/pages/blog/index.astro`
- Rewrite: `src/pages/blog/[...path].astro`
- Rewrite: `src/components/shell/BlogImage.astro`

- [ ] **Step 1: Rewrite blog index**

Replace `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";

const posts = (await getCollection("blog"))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime());

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
---

<BaseLayout title="Blog — João Gomes">
  <section class="mx-auto max-w-3xl px-6 pt-24 pb-24">
    <h1 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] mb-12">
      Blog
    </h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <a
          href={`/blog/${post.slug}`}
          class="group bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5 block"
        >
          <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
            {formatDate(post.data.datePublished)}
          </span>
          <h3 class="font-display text-xl font-semibold text-[var(--text-primary)] mt-2 group-hover:text-[var(--accent)] transition-colors duration-200">
            {post.data.title}
          </h3>
          <p class="font-mono text-[13px] font-light text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-2">
            {post.data.lead}
          </p>
          <span class="inline-block mt-4 font-mono text-xs text-[var(--accent)] border-b border-[var(--accent)] pb-0.5">
            Read more &rarr;
          </span>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Rewrite blog post template**

Replace `src/pages/blog/[...path].astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { path: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const readTime = Math.max(1, Math.floor(post.body.split(" ").length / 200));
---

<BaseLayout title={post.data.title} description={post.data.lead}>
  <article class="mx-auto max-w-[720px] px-6 pt-24 pb-24">
    <header class="mb-12">
      <h1 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] leading-tight">
        {post.data.title}
      </h1>
      {post.data.lead && (
        <p class="mt-4 font-mono text-base font-light text-[var(--text-secondary)] leading-relaxed">
          {post.data.lead}
        </p>
      )}
      <div class="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
        <span>{formatDate(post.data.datePublished)}</span>
        <span class="text-[var(--border)]">/</span>
        <span>{readTime} min read</span>
      </div>
    </header>
    <div class="prose prose-lg max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Update BlogImage.astro for astro:assets**

Replace `src/components/shell/BlogImage.astro`:

```astro
---
type Props = {
  src: string;
  alt: string;
  caption?: string;
};

const { src, alt, caption } = Astro.props;
---

<figure class="my-8">
  <img src={src} alt={alt} class="w-full rounded-lg" loading="lazy" />
  {caption && (
    <figcaption class="mt-2 text-center font-mono text-xs text-[var(--text-muted)] italic">
      {caption}
    </figcaption>
  )}
</figure>
```

- [ ] **Step 4: Verify and commit**

```bash
npm run dev
```

Check `/blog` and click into a post. Verify grid layout, prose styling, and dark/light mode.

```bash
git add -A
git commit -m "feat: new blog index grid and post template"
```

---

## Task 7: Portfolio Auth — Middleware + API Routes

**Files:**
- Create: `src/middleware.ts`
- Create: `src/pages/api/portfolio/login.ts`
- Create: `src/pages/api/portfolio/logout.ts`

- [ ] **Step 1: Create middleware**

Create `src/middleware.ts`:

```ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /portfolio routes (except request-access)
  if (!pathname.startsWith("/portfolio")) return next();
  if (pathname === "/portfolio/request-access") return next();

  // Check auth cookie
  const cookie = context.cookies.get("portfolio_auth");
  if (cookie) {
    try {
      const data = JSON.parse(cookie.value);
      if (data.authenticated && data.expires > Date.now()) {
        return next();
      }
    } catch {
      // Invalid cookie, fall through to redirect
    }
  }

  // Not authenticated — if already on /portfolio (login page), let it render
  if (pathname === "/portfolio" || pathname === "/portfolio/") {
    return next();
  }

  // Redirect to login with return URL
  const redirect = encodeURIComponent(pathname);
  return context.redirect(`/portfolio?redirect=${redirect}`);
});
```

- [ ] **Step 2: Create login API route**

Create `src/pages/api/portfolio/login.ts`:

```ts
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect")?.toString() || "/portfolio";

  if (password !== import.meta.env.PORTFOLIO_PASSWORD) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Set auth cookie — 24 hours
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  cookies.set("portfolio_auth", JSON.stringify({ authenticated: true, expires }), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return new Response(JSON.stringify({ success: true, redirect: redirectTo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

- [ ] **Step 3: Create logout API route**

Create `src/pages/api/portfolio/logout.ts`:

```ts
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("portfolio_auth", { path: "/" });
  return redirect("/portfolio");
};
```

- [ ] **Step 4: Add PORTFOLIO_PASSWORD to .env.development**

Add to `.env.development` (keep existing vars):

```
PORTFOLIO_PASSWORD=klapaucius
```

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts src/pages/api/
git commit -m "feat: portfolio auth middleware and API routes"
```

---

## Task 8: Portfolio Pages — Login, Index, Case Study

**Files:**
- Create: `src/pages/portfolio/index.astro`
- Create: `src/pages/portfolio/[slug].astro`
- Create: `src/pages/portfolio/request-access.astro`
- Modify: `src/content/config.ts`
- Create: `src/content/portfolio/` (directory for MDX case studies)

- [ ] **Step 1: Update content config**

Replace `src/content/config.ts`:

```ts
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
    client: z.string(),
    role: z.string(),
    datePublished: z.string().transform((date) => new Date(date)),
    lead: z.string(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean(),
  }),
});

export const collections = {
  blog: blogCollection,
  portfolio: portfolioCollection,
};
```

- [ ] **Step 2: Create a placeholder portfolio entry**

Create `src/content/portfolio/sample-case-study.mdx`:

```mdx
---
title: "Design System for E-Commerce Platform"
client: "Nivoda"
role: "Senior UX Designer"
datePublished: "2024-01-15"
lead: "Building a comprehensive design system for a global B2B diamond marketplace."
tags: ["Design Systems", "E-Commerce", "Figma", "React"]
draft: false
---

This is a placeholder case study. Replace with real content.
```

- [ ] **Step 3: Create portfolio index page (dual-purpose: login + listing)**

Create `src/pages/portfolio/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";

export const prerender = false;

// Check if authenticated
const cookie = Astro.cookies.get("portfolio_auth");
let isAuthenticated = false;
if (cookie) {
  try {
    const data = JSON.parse(cookie.value);
    isAuthenticated = data.authenticated && data.expires > Date.now();
  } catch {}
}

const redirectParam = Astro.url.searchParams.get("redirect") || "";

// Only fetch portfolio entries if authenticated
const entries = isAuthenticated
  ? (await getCollection("portfolio"))
      .filter((e) => !e.data.draft)
      .sort((a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime())
  : [];

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
---

<BaseLayout title="Portfolio — João Gomes">
  {isAuthenticated ? (
    <!-- Authenticated: show portfolio listing -->
    <section class="mx-auto max-w-3xl px-6 pt-24 pb-24">
      <h1 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] mb-12">
        Portfolio
      </h1>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <a
            href={`/portfolio/${entry.slug}`}
            class="group bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5 block"
          >
            <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
              {entry.data.client}
            </span>
            <h3 class="font-display text-xl font-semibold text-[var(--text-primary)] mt-2 group-hover:text-[var(--accent)] transition-colors duration-200">
              {entry.data.title}
            </h3>
            <p class="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--text-muted)] mt-1">
              {entry.data.role}
            </p>
            <p class="font-mono text-[13px] font-light text-[var(--text-secondary)] mt-3 leading-relaxed line-clamp-2">
              {entry.data.lead}
            </p>
            {entry.data.tags && (
              <div class="flex flex-wrap gap-1.5 mt-4">
                {entry.data.tags.map((tag) => (
                  <span class="font-mono text-[10px] text-[var(--text-muted)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  ) : (
    <!-- Not authenticated: show login form -->
    <section class="flex min-h-screen flex-col items-center justify-center px-6">
      <div class="w-full max-w-sm text-center">
        <h1 class="font-display text-[48px] font-extrabold text-[var(--text-primary)]">
          Portfolio
        </h1>
        <p class="mt-4 font-mono text-[13px] font-light text-[var(--text-secondary)] leading-relaxed">
          This portfolio is password-protected.<br />Enter the password to view my case studies.
        </p>
        <form id="login-form" class="mt-8 flex flex-col gap-3">
          <input type="hidden" name="redirect" value={redirectParam || "/portfolio"} />
          <input
            id="password-input"
            type="password"
            name="password"
            placeholder="Password"
            required
            class="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
          />
          <button
            type="submit"
            class="w-full font-display text-xs font-extrabold uppercase tracking-[2px] bg-[var(--accent)] text-[var(--accent-on)] py-3 rounded transition-colors duration-200 hover:bg-[var(--accent-hover)]"
          >
            Enter
          </button>
          <p id="error-msg" class="hidden font-mono text-xs text-red-500 mt-1">
            Incorrect password
          </p>
        </form>
        <p class="mt-8 font-mono text-xs text-[var(--text-muted)]">
          Don't have the password?
          <a href="/portfolio/request-access" class="text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-hover)] transition-colors duration-200">
            Request access
          </a>
        </p>
      </div>
    </section>
  )}
</BaseLayout>

<script is:inline>
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const res = await fetch("/api/portfolio/login", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.redirect || "/portfolio";
      } else {
        const input = document.getElementById("password-input");
        const error = document.getElementById("error-msg");
        input?.classList.add("shake", "border-red-500");
        error?.classList.remove("hidden");
        setTimeout(() => {
          input?.classList.remove("shake", "border-red-500");
        }, 600);
      }
    });
  }
</script>
```

- [ ] **Step 4: Create portfolio case study page**

Create `src/pages/portfolio/[slug].astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";

export const prerender = false;

const { slug } = Astro.params;
const entries = await getCollection("portfolio");
const entry = entries.find((e) => e.slug === slug);

if (!entry) {
  return Astro.redirect("/portfolio");
}

const { Content } = await entry.render();

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long" });
---

<BaseLayout title={`${entry.data.title} — João Gomes`} description={entry.data.lead}>
  <article class="mx-auto max-w-[720px] px-6 pt-24 pb-24">
    <header class="mb-12">
      <span class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--accent)]">
        {entry.data.client}
      </span>
      <h1 class="font-display text-[48px] font-extrabold text-[var(--text-primary)] leading-tight mt-2">
        {entry.data.title}
      </h1>
      <div class="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
        <span>{entry.data.role}</span>
        <span class="text-[var(--border)]">/</span>
        <span>{formatDate(entry.data.datePublished)}</span>
      </div>
      <p class="mt-4 font-mono text-base font-light text-[var(--text-secondary)] leading-relaxed">
        {entry.data.lead}
      </p>
      {entry.data.tags && (
        <div class="flex flex-wrap gap-1.5 mt-4">
          {entry.data.tags.map((tag) => (
            <span class="font-mono text-[11px] text-[var(--text-secondary)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] px-3 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
    <div class="prose prose-lg max-w-none">
      <Content />
    </div>
    <div class="mt-12 pt-8 border-t border-[var(--border-subtle)]">
      <a
        href="/portfolio"
        class="font-mono text-sm text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-hover)] transition-colors duration-200"
      >
        &larr; Back to portfolio
      </a>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 5: Create request access page**

Create `src/pages/portfolio/request-access.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout title="Request Portfolio Access — João Gomes">
  <section class="flex min-h-screen flex-col items-center justify-center px-6">
    <div class="w-full max-w-md">
      <h1 class="font-display text-[32px] font-extrabold text-[var(--text-primary)] text-center">
        Request Portfolio Access
      </h1>
      <p class="mt-3 font-mono text-[13px] font-light text-[var(--text-secondary)] text-center leading-relaxed">
        Leave your details and I'll get back to you with the password.
      </p>
      <form id="request-form" class="mt-8 flex flex-col gap-4">
        <div>
          <label class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5 block">Name</label>
          <input
            type="text"
            name="name"
            required
            class="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
          />
        </div>
        <div>
          <label class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5 block">Email</label>
          <input
            type="email"
            name="email"
            required
            class="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
          />
        </div>
        <div>
          <label class="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5 block">Message (optional)</label>
          <textarea
            name="message"
            rows="3"
            placeholder="Brief note about why you'd like access"
            class="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200 resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full font-display text-xs font-extrabold uppercase tracking-[2px] bg-[var(--accent)] text-[var(--accent-on)] py-3 rounded transition-colors duration-200 hover:bg-[var(--accent-hover)]"
        >
          Send Request
        </button>
      </form>
      <div id="success-msg" class="hidden text-center mt-8">
        <p class="font-mono text-sm text-[var(--accent)]">Request sent.</p>
        <p class="font-mono text-[13px] font-light text-[var(--text-secondary)] mt-2">I'll get back to you shortly.</p>
        <a
          href="/portfolio"
          class="inline-block mt-6 font-mono text-xs text-[var(--text-muted)] border-b border-[var(--text-muted)] pb-0.5 hover:text-[var(--text-primary)] transition-colors duration-200"
        >
          &larr; Back to portfolio
        </a>
      </div>
    </div>
  </section>
</BaseLayout>

<script is:inline>
  const form = document.getElementById("request-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      if (res.ok) {
        form.classList.add("hidden");
        document.getElementById("success-msg")?.classList.remove("hidden");
      }
    });
  }
</script>
```

- [ ] **Step 6: Create contact API route**

Create `src/pages/api/contact.ts`:

```ts
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  if (!name || !email) {
    return new Response(JSON.stringify({ error: "Name and email required" }), { status: 400 });
  }

  // Send email via Resend (or equivalent)
  // For now, log to console in dev. Replace with actual email API in production.
  const apiKey = import.meta.env.RESEND_API_KEY;
  const contactEmail = import.meta.env.CONTACT_EMAIL;

  if (apiKey && contactEmail) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <noreply@uxbyjoao.me>",
        to: contactEmail,
        subject: `Portfolio access request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message || "(none)"}`,
      }),
    });
  } else {
    console.log("[Contact Request]", { name, email, message });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
```

- [ ] **Step 7: Verify and commit**

```bash
npm run dev
```

Test: Visit `/portfolio`, see login form. Enter wrong password, see shake. Enter correct password (`klapaucius`), see portfolio listing. Visit `/portfolio/sample-case-study`, see case study. Visit `/portfolio/request-access`, see contact form.

```bash
git add -A
git commit -m "feat: password-protected portfolio with login, case studies, and request access form"
```

---

## Task 9: Polish — View Transitions + Scroll Animations

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/scripts/scroll-reveal.ts`

- [ ] **Step 1: Add Astro View Transitions**

In `src/layouts/BaseLayout.astro`, add to the `<head>`:

```astro
---
import { ViewTransitions } from "astro:transitions";
// ... existing imports
---

<head>
  <MetaHead title={title} description={description} ogImageUrl={ogImageUrl} />
  <ViewTransitions />
</head>
```

- [ ] **Step 2: Create scroll reveal script**

Create `src/scripts/scroll-reveal.ts`:

```ts
function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-up");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => {
    (el as HTMLElement).style.opacity = "0";
    observer.observe(el);
  });
}

// Run on initial load and after view transitions
initScrollReveal();
document.addEventListener("astro:after-swap", initScrollReveal);
```

- [ ] **Step 3: Add data-reveal attributes to key elements**

In `src/components/home/Experience.astro`, add `data-reveal` to each `<article>`:

```astro
<article data-reveal class="bg-[var(--surface)] ...">
```

In `src/components/home/Education.astro`, same pattern.

In blog and portfolio card grids, add `data-reveal` to each card `<a>`.

- [ ] **Step 4: Import scroll-reveal in BaseLayout**

In `src/layouts/BaseLayout.astro`, add before the closing `</body>`:

```astro
<script src="../scripts/scroll-reveal.ts"></script>
```

- [ ] **Step 5: Verify and commit**

```bash
npm run dev
```

Navigate between pages — verify smooth transitions. Scroll down — verify cards fade in. Test on mobile viewport.

```bash
git add -A
git commit -m "feat: view transitions and scroll reveal animations"
```

---

## Task 10: Final Cleanup + Build Verification

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.gitignore`
- Delete: `public/assets/fonts/Inter/` (old font files)

- [ ] **Step 1: Update CLAUDE.md**

Update `CLAUDE.md` to reflect the new architecture: Astro 4.x, hybrid output, new design system tokens, portfolio auth, removed dependencies.

- [ ] **Step 2: Add .superpowers to .gitignore**

Append to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 3: Remove old Inter font files**

```bash
rm -rf public/assets/fonts/Inter/
```

- [ ] **Step 4: Full build verification**

```bash
npm run build
```

Fix any build errors.

- [ ] **Step 5: Run dev server and do a full walkthrough**

```bash
npm run dev
```

Verify every route:
- `/` — Hero + key experiences
- `/experience` — Full experience + education
- `/blog` — Blog grid
- `/blog/[slug]` — Blog post
- `/portfolio` — Login form (when unauthenticated)
- `/portfolio` — Case study listing (when authenticated)
- `/portfolio/[slug]` — Case study
- `/portfolio/request-access` — Contact form

Verify: dark/light toggle, mobile nav, responsive layout at 375px, 768px, 1280px.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, update docs, remove old assets"
```
