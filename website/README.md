# Zon Website (Static React + Vite)

A static, Cloudflare Pages-friendly marketing site for **Zon**, based on publicly available Steam content and repo context.

## Stack
- React
- TypeScript
- Vite

## Run locally
```bash
cd website
npm install
npm run dev
```

## Share with Cloudflare Tunnel
For a temporary public link from your machine:

```powershell
cd website
npm install
npm run share
```

The script starts Vite on `http://127.0.0.1:5173/` if needed, then runs a Cloudflare Tunnel.
Copy the `https://*.trycloudflare.com` URL printed by `cloudflared` and send it to people you want to show the site to.

Vite is configured to allow `*.trycloudflare.com` hosts for this share workflow.

Prerequisite: `cloudflared` must be installed and available on PATH.

## Build
```bash
cd website
npm install
npm run build
```

Build output is generated in `website/dist`.

## Deploy to Cloudflare Pages
Create a Cloudflare Pages project pointed at this repository and use:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `website/dist`
- **Root directory (recommended):** `website`

If you set the Pages root directory to `website`, your build output directory should be `dist`.

## Content/source notes
- Gameplay copy and claims are based on the Steam store listing for Zon (`app/3651110`).
- Steam media is referenced via official Steam CDN image URLs and an official Steam widget embed.
- Instagram is linked as a social channel; the page design tone uses a neon sci-fi action aesthetic aligned with the game's public branding direction.

## Assumptions
- No backend is required.
- No runtime scraping is used.
- External media references are public Steam-hosted assets.
