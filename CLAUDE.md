# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`Sn0w` is L1nSn0w's personal homepage and blog merged into one static site. It is
an Astro site with one layout, a small set of pages, and a Markdown content
collection. There is no router, backend, database, or client framework. The
visual base comes from [PlainBlog](https://github.com/wutongyuonce/PlainBlog)
(MIT), with the original homepage content and the posts from the former blog
repository folded in.

## Commands

Package manager is **bun**.

```bash
bun install
bun run dev          # astro dev
bun run check        # astro check (TypeScript + Astro diagnostics)
bun run build        # astro build → dist/
bun run preview      # serve dist/
bun run test         # node --test tests/*.test.mjs (publication rules)
bun run format       # prettier --write .
bun run format:check # prettier --check .
```

Canonical and RSS absolute URLs default to `https://sn0w.fyi/`; set `SITE_URL`
at build time to override the origin (preview deploys, domain moves).

## Architecture

- **`src/pages/`** — route entry points. `index.astro` is the home page: a flat
  full-column layout (`.home`, no card) with an `I'm <name>` 20px `h1` whose
  28px avatar slides in on hover, the English `HomeIntro.astro` block (inline
  brand icons, a plain Email link and a Coffee Chat pill from `site.email` /
  `site.coffeeChat`), the Experience and Projects rows from `site.work` /
  `site.projects`, and a footer with icon-only social links (CSS tooltip from
  `data-tip` on hover/focus) plus `site.elsewhere` — no post list;
  `blog/index.astro` is the
  article list (`/blog/`) grouped by year, reachable from the breadcrumb menu;
  `about.astro` and `projects.astro` render Markdown pages;
  `blog/[slug].astro` renders one post; `rss.xml.ts` builds the full-text feed;
  `sitemap.xml.ts` lists every page and post with `lastmod`;
  `robots.txt.ts` allows crawling and points at the sitemap;
  `404.astro` is the not-found page.
- **`src/layouts/Base.astro`** — the single HTML shell: theme bootstrap script,
  metadata/canonical/OG tags, article dates, JSON-LD (BreadcrumbList by default,
  plus page-supplied schema), the optional `noindex`, breadcrumb, theme toggle,
  and the slot. All pages go through it.
- **`src/components/Breadcrumb.astro`** — home link plus the native
  `<details>` site menu driven by `site.nav`, and the `Home / Blog / title`
  article path.
- **`src/components/HomeIntro.astro`** — the home page intro paragraphs, in
  English, with inline `<Icon>` marks and links, plus the inline `meme.gif`
  thumb that reveals a rounded preview on hover/focus; wrap icon + word in
  `.keep` so an icon never ends a line, and keep each `<p>` under
  `<!-- prettier-ignore -->` so reformatting cannot turn a line break into a
  stray space before punctuation.
- **`src/components/HomeRow.astro`** — one Experience/Projects row: optional left icon,
  `name ~ role`, optional right-side stack icons and meta; renders a link when
  `href` exists, otherwise a plain row. On hover/focus the URL label replaces
  the stack icons.
- **`src/components/Icon.astro`** — renders a mark from `social-icons.mjs` or
  `brand-icons.mjs`: vector paths as inline `<svg>` in the mark's brand `color`
  (or `currentColor` with `mono`), `src` entries as `<img>` (or, with `mono`,
  a `mask` span tinted by `currentColor`).
- **`src/components/Lightbox.astro`** — article image viewer rendered only by
  `blog/[slug].astro`; wraps `.prose img` in a button at runtime and opens the
  full-size image in a native `<dialog>` (Esc, backdrop, close button).
- **`src/config.ts`** — site identity, the `email` / `coffeeChat` contact links,
  navigation, social links, "Elsewhere" links, and the `work` / `projects` rows
  rendered on the home page.
- **`src/lib/brand-icons.mjs`** — Simple Icons (CC0), Heroicons (MIT), FormKit
  icons (MIT), Boxicons (CC BY 4.0, the coffee-chat cup) and Radix Icons (MIT,
  the memo link's `paper` mark) path data for the stack/subject marks (viewBoxes
  cropped to each glyph), plus `src` entries pointing at the official logos in
  `public/icons/` (`dify.svg`, `gdut.png`, `ech0.svg`, `dox.png`, `kemate.png`,
  `sqlite.svg`, `kubernetes.svg`, `docker.svg`).
- **`src/content/posts/<slug>/index.md`** — one directory per post; the
  directory name is the slug. Frontmatter: required `title` and quoted
  `YYYY-MM-DD` `date`; optional `description` (search/social summary), quoted
  `YYYY-MM-DD` `updated` (sitemap/schema modification date), and `draft: true`.
  Images live beside `index.md` and are referenced as `./file.webp`.
- **`src/content/pages/`** — `about.md` and `projects.md`, imported as
  components by their pages. The home intro is `HomeIntro.astro`, not Markdown.
- **`src/content.config.ts` / `src/lib/publication.mjs`** — the single authority
  for date validation, slug validation, draft exclusion, deduplication, and
  sorting. Pages call `selectPublished()`; never re-implement these rules.
- **`src/lib/paths.ts`** — prefixes site-root paths with Astro's `BASE_URL`
  (currently `/`; kept so a sub-path deployment would still work).
- **`src/lib/excerpt.mjs`** — plain-text fallback used for a post's meta
  description when its frontmatter has no `description`.
- **`src/styles/global.css`** — the whole design system: CSS custom properties
  for the dark/light palette, typography, the home profile block, breadcrumbs,
  post lists, prose, code/table/image styling, the `.gallery` grid, and the
  theme toggle.
- **`astro.config.mjs`** — Satteri Markdown pipeline. Enables container
  directives and turns `:::gallery` into a `.gallery` wrapper while keeping its
  image nodes in the AST, so Astro hashes, sizes, and lazy-loads them.
- **`public/`** — favicons, avatar, official brand logos in `public/icons/`,
  the hover meme (`meme.gif`), and `_headers`.

## Content workflow

- Add a post as `src/content/posts/my-post/index.md`; it appears in the
  `/blog/` list and gets `/blog/my-post/` without editing routes.
- Put images in the same directory and reference them as `./file.webp`.
  Consecutive images can be wrapped in `:::gallery` for a grid. Every article
  image opens the lightbox on click; images inside links are left alone.
- Prefer plain text over inline code and bold for emphasis; reserve inline code
  for literal commands, paths, and identifiers.
- Drafts (`draft: true`) are excluded from the `/blog/` list, article routes,
  and RSS.
- About/projects copy lives in `src/content/pages/`; the home intro is
  `src/components/HomeIntro.astro`; Experience/Projects rows and links live in
  `src/config.ts`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) runs install, check, test, build.
Cloudflare's own Git build for the `sn0w` Worker publishes `dist/` on every push;
the workflow's `wrangler deploy` step only runs when `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` secrets exist. `wrangler.jsonc` declares Workers Static
Assets with `./dist` and `not_found_handling: "404-page"` — there is no Worker
script. Do not add an adapter or turn the site into SSR.

## Conventions

- Prettier handles formatting (`prettier.config` equivalent in
  `.prettierrc.json`); run `bun run format` before committing.
- Keep the PlainBlog visual language: system fonts, 65ch content column, 16px
  base type, monospace dates/years, minimal chrome, no decorative footer or
  animation.
- Pages must keep exactly one `<h1>`, unique `<title>`/description, the skip
  link, and keyboard-operable navigation.
- No React/Vue/Tailwind, client-side router, runtime Markdown, CMS, or tracking.
