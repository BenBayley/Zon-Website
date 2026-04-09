---
name: zon-website-maintainer
description: Maintain the Zon / Ben Bayley static portfolio website in this repository. Use when implementing website features, changing Steam or itch.io content, editing the React/Vite app, reviewing a pull request or diff, troubleshooting build/media/metadata issues, or deciding how to validate changes under the website/ project.
---

# Zon Website Maintainer

## Start Here

Read root `AGENTS.md` first. Then inspect `git status --short --branch` and work from `website/` for npm commands.

This is a static marketing / portfolio site for Zon and Ben Bayley: React 18, strict TypeScript, Vite, no backend.

## Navigation

- App structure and component state: `website/src/App.tsx`
- Steam media, trailer/widget/store URLs, portfolio links: `website/src/content.ts`
- Global CSS and responsive rules: `website/src/styles.css`
- Browser title, favicon, SEO/social metadata: `website/index.html`
- Deployment/run notes: `website/README.md`

## Change Workflow

1. Classify the request: content/link/media, React behavior, CSS/layout, document metadata, or deployment/docs.
2. Edit the narrow owner file. Keep Steam/itch URLs in `content.ts`; do not scatter duplicate constants through components.
3. Preserve the static deployment model: do not add a server, runtime scraper, secret, database, or authenticated API unless the user explicitly changes scope.
4. Keep the landing experience immediate. For this site, the hero video/trailer, wishlist CTA, screenshot carousel, Steam widget/fallback, itch.io CTA, header links, and footer links are the core user path.
5. Run `npm run build` from `website/`. If it already failed before your edits, say that separately and include the TypeScript/Vite error.

## Review Workflow

Prioritize findings with file/line references. Check:

- TypeScript errors, unused imports/constants, timer cleanup, button/link semantics, and external-link `rel="noreferrer"`.
- Steam store/widget/trailer/media URLs and itch.io URL.
- `index.html` title, description, Open Graph, Twitter card, canonical-ish URL assumptions, favicon path, and preview image.
- Keyboard operation for overlay toggle and carousel buttons; skip link still targets existing content.
- Responsive layout near mobile widths, especially fixed topbar, hero overlay controls, buttons, Steam widget aspect ratio, carousel labels/buttons/dots, footer wrapping.
- Asset additions under `website/src/assets/`: intentional use, size, alt text, favicon suitability, no stale imports.

## Visual Validation

When visual behavior changes, run the dev server and inspect at least one desktop and one narrow viewport. Verify:

- Hero poster/video renders and overlay can be hidden/restored.
- Carousel auto-advances and previous/next controls move the image.
- Steam widget area has a direct Steam fallback link nearby.
- Text remains readable over media and does not overflow its parent.

## Commands

```powershell
cd website
npm run build
npm run dev
npm run preview
```

There is no committed `test` or `lint` npm script. Add one only as part of an explicit testing/tooling change.
