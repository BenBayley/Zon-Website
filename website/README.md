# Zon Website (Static React + Vite)

A static, Cloudflare Pages-friendly marketing site for **Zon**, based on publicly available Steam content and repo context. The site now also supports an optional Instagram section powered by the C# backend under `../backend/`.

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

If you want the homepage Instagram section to call the local backend, copy `.env.example` to `.env` and set:

```bash
VITE_SOCIAL_API_BASE_URL=http://localhost:7071
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

If you deploy the Instagram backend, also set the Cloudflare Pages environment variable:

- `VITE_SOCIAL_API_BASE_URL=https://<your-azure-functions-host>`

If you set the Pages root directory to `website`, your build output directory should be `dist`.

## Content/source notes
- Gameplay copy and claims are based on the Steam store listing for Zon (`app/3651110`).
- Steam media is referenced via official Steam CDN image URLs and an official Steam widget embed.
- The Instagram section reads from the optional C# backend in `../backend/`, which is intended to use Meta's official API rather than scraping.

## Assumptions
- The frontend remains a static site on Cloudflare Pages.
- The optional Instagram backend is hosted separately and no runtime scraping is used.
- External media references are public Steam-hosted assets.
