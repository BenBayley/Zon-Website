# Zon Website Agent Guide

## Project Shape
- Static React + TypeScript + Vite site. Work from `website/` for npm commands.
- Project-local Codex skill lives at `.codex/skills/zon-website-maintainer/`; use it for implementation, review, testing, and troubleshooting on this site.
- Main app composition lives in `website/src/App.tsx`.
- External Steam media, Steam/itch links, and portfolio constants live in `website/src/content.ts`.
- Global styling lives in `website/src/styles.css`.
- Document metadata and social preview tags live in `website/index.html`.
- Build output is `website/dist/`; do not edit generated build output.

## Commands
```powershell
cd website
npm run dev
npm run build
npm run preview
```

- `npm run build` is the required automated validation. It runs `tsc -b` and `vite build`.
- There is currently no committed lint/test script. Do not invent a test command without adding and documenting it.

## Implementation Notes
- Keep feature/content changes narrow. Prefer updating `content.ts` for URLs/media/copy constants, `App.tsx` for structure/state, and `styles.css` for presentation.
- Preserve the static-site constraint: no backend, runtime scraping, server-only secrets, or deploy-time service dependency.
- Treat Steam CDN URLs and the Steam widget as external public media. Keep a plain link fallback to the Steam page near embedded Steam experiences.
- Preserve accessibility affordances: the skip link, meaningful link/button labels, iframe title, image alt text, keyboard-focusable buttons, and visible focus/hover states.
- Keep the hero/video/media experience responsive. When changing layout or media, check mobile-width behavior and desktop hero framing.
- Keep Cloudflare Pages defaults aligned with `website/README.md`: recommended root directory `website`, build command `npm run build`, output directory `dist`.

## Review Checklist
- Run `git status --short --branch` before editing and preserve unrelated user changes.
- Build from `website/` with `npm run build`; report pre-existing build failures separately from your edits.
- For content/CTA changes, verify the Steam store URL, Steam widget URL, trailer sources, itch.io URL, and Open Graph/Twitter metadata.
- For visual changes, run the site locally and inspect hero video/overlay states, carousel controls/dots, Steam widget/fallback link, footer links, and 720px-or-narrower layout.
- Watch asset size and intent when adding files under `website/src/assets/`; remove unused imports/assets only when they are part of the requested change.
