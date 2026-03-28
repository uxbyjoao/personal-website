# Site Overhaul — Design Spec

Three workstreams: dependency upgrade, design overhaul, and protected portfolio.

## Workstream 1: Dependency Upgrade

Upgrade from Astro 2.0.11 to Astro 4.x (latest stable).

### Breaking changes to handle

- **`@astrojs/image` removed** — replaced by built-in `astro:assets`. All `<Image>` imports change.
- **`@astrojs/prefetch` removed** — prefetching is now built into Astro core. Remove the integration, enable via config.
- **Content Collections API changes** — Astro 3+ moved collections to `src/content/config.ts` exports and changed the query API. Astro 4 requires `astro:content` imports.
- **View Transitions** — Astro 3+ ships built-in view transitions. We can use these instead of animejs for page transitions.
- **`output: "hybrid"`** — Astro 4 supports `hybrid` output mode (static by default, opt-in to SSR per route). Better fit than `server` since most pages are prerendered anyway.

### Dependency changes

| Package | Action |
|---------|--------|
| `astro` | Upgrade to ^4.x |
| `@astrojs/vercel` | Upgrade to latest compatible |
| `@astrojs/mdx` | Upgrade to latest compatible |
| `@astrojs/tailwind` | Upgrade to latest compatible |
| `@astrojs/sitemap` | Upgrade to latest compatible |
| `@tailwindcss/typography` | Upgrade to latest |
| `@astrojs/image` | **Remove** — use `astro:assets` |
| `@astrojs/prefetch` | **Remove** — use built-in |
| `animejs` | **Remove** — replace with CSS animations / View Transitions |
| `astro-icon` | **Remove** — replace with inline SVG components (Tabler icons downloaded as .svg files) |
| `astro-robots-txt` | Upgrade to latest |
| `@vercel/analytics` | Upgrade to latest |
| `prettier` | Upgrade to ^3.x |
| `prettier-plugin-tailwindcss` | Upgrade to latest compatible |

### Config changes

- `astro.config.mjs`: Change `output: "server"` to `output: "hybrid"`. Remove `image()` and `prefetch()` integrations. Enable `prefetch: true` in config.
- Pages that are currently `export const prerender = true` become the default behavior. Only portfolio auth routes need `export const prerender = false`.

---

## Workstream 2: Design Overhaul

Complete visual redesign. Same page structure, same content, new design system.

### Design System Tokens

#### Typography

| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| Display | Outfit | 800 | clamp(42px, 6vw, 76px) | Hero headline. letter-spacing: -1px |
| H1 | Outfit | 800 | 48px | Page headings |
| H2 | Outfit | 800 | 32px | Section headings |
| H3 | Outfit | 600 | 20px | Card titles, job titles |
| Body | JetBrains Mono | 300 | 14px | line-height: 1.85 |
| Label | JetBrains Mono | 400 | 11px | uppercase, letter-spacing: 2-3px |
| Button | Outfit | 800 | 12px | uppercase, letter-spacing: 2px |

Load Outfit (weights 300, 400, 600, 800) and JetBrains Mono (weights 300, 400) from Google Fonts. Self-host for production performance.

#### Color Palette

**Dark mode (default):**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | #050505 | Page background |
| `--surface` | #0a0a0a | Cards, nav, elevated panels |
| `--surface-elevated` | #111111 | Hover states, active elements |
| `--border` | rgba(255,255,255,0.06) | Dividers, card borders |
| `--border-subtle` | rgba(255,255,255,0.04) | Faint separators |
| `--text-primary` | #ffffff | Headings, primary content |
| `--text-secondary` | #999999 | Body text, descriptions |
| `--text-muted` | #555555 | Metadata, dates, labels |
| `--accent` | #A3E635 | Neon lime — CTAs, active states, highlights |
| `--accent-hover` | #BEF264 | Lighter lime for hover |
| `--accent-surface` | rgba(163,230,53,0.08) | Subtle accent backgrounds |
| `--accent-on` | #050505 | Text color on accent backgrounds |

**Light mode:**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | #fafafa | Page background |
| `--surface` | #ffffff | Cards, nav |
| `--surface-elevated` | #f5f5f5 | Hover states |
| `--border` | rgba(0,0,0,0.08) | Dividers |
| `--border-subtle` | rgba(0,0,0,0.04) | Faint separators |
| `--text-primary` | #0a0a0a | Headings |
| `--text-secondary` | #555555 | Body text |
| `--text-muted` | #999999 | Metadata |
| `--accent` | #65A30D | Darker lime for contrast on white |
| `--accent-hover` | #4D7C0F | Darker on hover |
| `--accent-surface` | rgba(101,163,13,0.08) | Subtle accent backgrounds |
| `--accent-on` | #ffffff | Text on accent backgrounds |

Implement with CSS custom properties on `:root` (dark) and `[data-theme="light"]`. Toggle stored in localStorage, defaults to dark.

#### Buttons

- **Primary**: `--accent` background, `--accent-on` text, 4px border-radius, `padding: 10px 24px`
- **Secondary**: Transparent, `--border` with elevated opacity for visibility, `--text-primary` text
- **Link**: `--accent` text with 1px bottom border, arrow suffix `→`

### Navigation

Fixed top bar with backdrop blur. Full-width, content constrained.

- **Left**: "JG" logotype in Outfit 800
- **Right**: Nav links in JetBrains Mono 11px uppercase + Portfolio CTA button (lime filled) + theme toggle icon
- **Active state**: Link text in `--accent` color
- **Background**: `--bg` at 80% opacity + `backdrop-filter: blur(20px)`
- **Border**: `--border-subtle` bottom border
- **Mobile**: Hamburger icon reveals full-screen overlay menu. Links stack vertically, centered. Portfolio CTA prominent. Use CSS transitions instead of animejs.

### Hero Section (Home)

Full-viewport centered layout.

- Top label: "João Gomes — Berlin" in Label style, `--text-muted` color
- Headline: "Senior UX Designer crafting **digital clarity**" in Display style, accent word in `--accent`
- Description: One line in Body style, `--text-muted`
- Two CTAs: "Explore Work" (primary) + "Experience" (secondary)
- Bottom center: "Scroll to explore ↓" in Label style, `--text-muted`
- Content vertically and horizontally centered with flexbox
- Minimum height: 100vh

### Experience Section (Home + Experience Page)

Replace the current two-column sticky layout with a timeline-inspired vertical layout.

- Section heading in H1 style, left-aligned
- Each entry is a card on `--surface` background with `--border` border, `border-radius: 8px`, `padding: 32px`
- Card layout:
  - Top row: Date range in Label style (left), Location in Label style (right)
  - Title in H2 style
  - Company name in Body style, `--accent` color
  - Description bullets in Body style, `--text-secondary`
  - Skill tags row at bottom: JetBrains Mono 11px, `--text-secondary`, background `rgba(255,255,255,0.04)`, border `--border`, 4px radius
- Cards stack vertically with 16px gap
- Home page shows only `key: true` entries (existing behavior)
- Experience page shows all entries

### Education Section

Same card treatment as experience, simpler content:
- Institution name in H3
- Location in Label style
- Degree/description in Body style
- Date in Label style

### Blog Index

Grid of blog post cards.

- 2-column grid on desktop, 1-column on mobile
- Each card: `--surface` background, `--border` border, 8px radius, `padding: 24px`
- Card content:
  - Date in Label style
  - Title in H3 style, `--text-primary`
  - Lead paragraph in Body style, `--text-secondary`, 2-line clamp
  - "Read more →" link in accent Link style
- Hover: Card background shifts to `--surface-elevated`

### Blog Post

Full-width readable layout, max-width 720px centered.

- Title in H1
- Lead in Body style, larger (16px), `--text-secondary`
- Date + read time in Label style
- Content rendered via MDX with `@tailwindcss/typography` prose styles, customized for the new palette:
  - Prose headings: Outfit 800
  - Prose body: JetBrains Mono 300
  - Prose links: `--accent` color
  - Prose code: `--surface` background
  - Images: full-bleed within the 720px column, 8px radius

### Footer

Minimal horizontal bar.

- Left: "João Gomes" in Outfit 600 + copyright year
- Right: Social icons (GitHub, Behance, LinkedIn) as SVG icons, `--text-muted`, hover `--accent`
- Separator: `--border-subtle` top border
- Generous vertical padding (80px top/bottom)

### Animations & Interactions

- **Page transitions**: Use Astro View Transitions for smooth page-to-page animation (fade/slide)
- **Scroll reveals**: CSS `@keyframes` + `IntersectionObserver` for content appearing on scroll. Subtle fade-up with 20px translate, 0.4s ease-out.
- **Hover states**: 200ms color transitions everywhere. Cards lift slightly on hover (`translateY(-2px)` + subtle shadow).
- **Mobile nav**: CSS transform + transition for slide-in drawer. No animejs dependency.
- **No heavy animation libraries**. CSS-first, JS only for intersection observer triggers.

### Responsive Approach

- Mobile-first with Tailwind breakpoints
- Single column below `md` (768px)
- Hero scales headline via `clamp()` — works at all sizes
- Nav collapses to hamburger below `md`
- Blog grid goes 1-column below `md`
- Experience cards: full-width at all sizes, internal layout adjusts

---

## Workstream 3: Protected Portfolio

Password-gated case study section using Astro Content Collections and cookie-based auth.

### Content Collection

Add a `portfolio` collection in `src/content/config.ts`:

```ts
const portfolioCollection = defineCollection({
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
```

Portfolio case studies live in `src/content/portfolio/` as MDX files.

### Routes

| Route | Prerender | Purpose |
|-------|-----------|---------|
| `/portfolio` | No (SSR) | Dual-purpose: login form when unauthenticated, case study listing when authenticated |
| `/portfolio/[slug]` | No (SSR) | Individual case study |
| `/portfolio/request-access` | Yes (static) | Contact form to request password |
| `/api/portfolio/login` | No (SSR) | POST: validate password, set cookie |
| `/api/portfolio/logout` | No (SSR) | POST: clear auth cookie |
| `/api/contact` | No (SSR) | POST: send access request email |

### Authentication Flow

1. User visits `/portfolio` or `/portfolio/[slug]`
2. Middleware checks for `portfolio_auth` cookie
3. If no valid cookie → redirect to `/portfolio` which renders the login form
4. Login form POSTs to `/api/portfolio/login`
5. API validates password against `import.meta.env.PORTFOLIO_PASSWORD`
6. On success: Set `portfolio_auth` cookie (httpOnly, secure, sameSite: lax, maxAge: 24 hours) containing JSON `{ authenticated: true, expires: timestamp }`
7. Redirect to original destination (or `/portfolio` index)
8. On failure: Return error, client shows shake animation + "Incorrect password" message

### Middleware

`src/middleware.ts`:
- Intercepts all `/portfolio/*` routes except `/portfolio/request-access`
- Checks `portfolio_auth` cookie existence and expiration
- Invalid/expired → redirect to `/portfolio?redirect={original_path}`
- Valid → pass through

### Login Page Design

Centered on the page, minimal:
- Outfit 800 heading: "Portfolio"
- JetBrains Mono body: "This portfolio is password-protected. Enter the password to view my case studies."
- Password input field: `--surface` background, `--border` border, full-width, JetBrains Mono
- "Enter" primary button
- Error state: Input shakes (CSS `@keyframes shake` — 3 quick horizontal oscillations, 300ms), red border flash, "Incorrect password" message below in `--text-secondary`
- Below the form: "Don't have the password?" link → `/portfolio/request-access`

### Request Access Page

`/portfolio/request-access` — static page with a contact form:
- Heading: "Request Portfolio Access"
- Fields: Name (text), Email (email), Message (textarea, optional — "Brief note about why you'd like access")
- Submit button (primary)
- On submit: POST to `/api/contact` which sends an email to you with the requester's details
- Success state: Replace form with "Request sent. I'll get back to you shortly."
- Email delivery: Vercel serverless function. Use `fetch` to hit an email API (Resend recommended for simplicity, but can be swapped). Store API key in env var.

### Portfolio Index (Authenticated)

Grid of case study cards, similar to blog index but with richer metadata:
- 2-column grid
- Each card: Thumbnail image (if available), title in H3, client name in `--accent`, role in Label style, tags, lead paragraph
- Cards link to `/portfolio/[slug]`
- Hover: same card lift treatment as blog cards

### Portfolio Case Study (Authenticated)

Same base layout as blog posts (720px centered), but with a richer header:
- Client name in Label style, `--accent`
- Title in H1
- Role + date range in Label style
- Lead paragraph in Body style (16px)
- Tags row
- MDX content below with same prose styling as blog

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `PORTFOLIO_PASSWORD` | Shared password for portfolio access |
| `RESEND_API_KEY` | (or equivalent) Email delivery for contact form |
| `CONTACT_EMAIL` | Destination email for access requests |

---

## Execution Order

1. **Dependency upgrade** — Astro 4.x, remove deprecated packages, fix breaking changes, verify build
2. **Design tokens + base layout** — CSS custom properties, font loading, Tailwind config, BaseLayout, Navbar, Footer
3. **Home page** — Hero section, experience section (key entries only)
4. **Experience page** — Full experience + education with new card design
5. **Blog** — Blog index grid + blog post template with new prose styles
6. **Portfolio auth** — Middleware, login page, API routes, cookie handling
7. **Portfolio content** — Collection setup, index page, case study template, request access form
8. **Polish** — View transitions, scroll animations, mobile nav, responsive QA
