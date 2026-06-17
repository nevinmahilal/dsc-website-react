# AGENTS.md — Claude Code Guidance for dsc-website

## Project Overview
This is a Next.js 16 App Router project for the DSC (Data Solutions Inc.) website, built with TypeScript, Tailwind v4, and static site generation.

## Architecture Rules
- **Router:** App Router only (`src/app/`). Never use `pages/` directory.
- **Rendering:** SSG (Static Site Generation) by default. No data-fetching libs (`react-query`, `swr`).
- **Path alias:** `@/*` maps to `src/*`.
- **Animations:** CSS-only via Tailwind keyframes. No `framer-motion`.
- **Sitemap:** Use `app/sitemap.ts` only. Do NOT install `next-sitemap`.

## Tailwind v4 Configuration
Brand tokens are defined in `src/app/globals.css` via `@theme` block. Do NOT use `tailwind.config.ts` for brand tokens.

### Brand Colors
- `--color-tech-teal: #40BFCC` (primary — note: NOT `#3FBFCC`)
- `--color-cool-charcoal: #171D24`
- `--color-cool-white: #E7F4F8`
- `--color-dark-teal: #2E8B9A`
- `--color-mute-blue: #A2CADB`
- `--color-body-text: #333333`

### Breakpoints
`sm: 375px`, `md: 768px`, `lg: 1280px`, `xl: 1440px`

## Typography
- Font: Outfit (Google Font) — weights 100, 300, 600 only
- Variable: `--font-outfit`
- Applied as `fontFamily.sans`

## Environment Variables
See `.env.example` for required slots. Never commit `.env.local`.

## Testing
- Unit/integration: Jest (or Vitest if configured)
- E2E: Playwright (`@playwright/test`)

## Key Packages
- Forms: `react-hook-form` + `zod` + `@hookform/resolvers`
- Tables: `@tanstack/react-table`
- Email: `resend`
- Content: `next-mdx-remote` + `gray-matter`
- reCAPTCHA: `react-google-recaptcha`
