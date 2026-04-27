# GoldenHeart Marketplace — Vendor Landing Page

A high-converting merchant onboarding landing page for GoldenHeart Marketplace. Built with React, Vite, and Tailwind CSS. Form submissions are sent to Privyr CRM via webhook.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — blazing fast HMR and builds
- **Tailwind CSS 4** — utility-first styling
- **Motion (Framer Motion)** — animations
- **React Hook Form + Zod** — form handling with validation
- **Privyr CRM** — lead management via webhook

## Local Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

> **Note:** Form submissions require the Privyr webhook. In local dev mode, submissions to `/api/submit-lead` will return a 404 since there's no local API server. To test locally, you can use `vite preview` after building, or set up a local proxy.

## Build

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## Deployment

### Option 1: Vercel (Recommended)

1. Push your repo to GitHub/GitLab/Bitbucket
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel will auto-detect the Vite framework
4. Add the environment variable in Vercel's Settings → Environment Variables:
   - `PRIVYR_WEBHOOK_URL` = your Privyr webhook URL
5. Deploy!

The `/api/submit-lead` endpoint is handled by the serverless function in `api/submit-lead.ts`.

### Option 2: cPanel (Shared Hosting)

1. Run `npm run build` locally
2. Upload the contents of `dist/` to your `public_html/` directory
3. Upload `.htaccess` to `public_html/` (for SPA routing)
4. Upload `cpanel/api/submit-lead.php` to `public_html/api/submit-lead.php`
5. Edit the `$WEBHOOK_URL` in the PHP file with your real Privyr webhook URL

**cPanel folder structure:**
```
public_html/
├── api/
│   └── submit-lead.php    ← from cpanel/ folder
├── assets/
│   ├── index-XXXX.js
│   └── index-XXXX.css
├── index.html             ← from dist/
└── .htaccess              ← from project root
```

## Environment Variables

| Variable             | Where Used        | Description                       |
|----------------------|-------------------|-----------------------------------|
| `PRIVYR_WEBHOOK_URL` | Server-side only  | Privyr CRM webhook URL for leads  |

## Project Structure

```
├── api/                    # Vercel serverless functions
│   └── submit-lead.ts      # Lead form → Privyr webhook
├── cpanel/                 # cPanel deployment files
│   └── api/
│       └── submit-lead.php # PHP equivalent of the API
├── shared/                 # Shared types and content
│   ├── schemas.ts          # Zod validation schemas
│   └── site-content.ts     # Static site content data
├── src/                    # React application
│   ├── components/         # UI components
│   │   ├── sections/       # Page sections
│   │   └── ui/             # Reusable UI primitives
│   ├── lib/                # Utilities and constants
│   ├── providers/          # React context providers
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── .htaccess               # Apache SPA routing (for cPanel)
├── vercel.json             # Vercel deployment config
├── vite.config.ts          # Vite build config
└── index.html              # HTML template
```