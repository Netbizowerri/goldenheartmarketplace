# GoldenHeart Marketplace Vendor Landing Page

A React + Vite landing page for GoldenHeart Marketplace vendor onboarding. Form submissions go to Privyr and can also trigger Resend emails for the visitor and admin.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
- React Hook Form + Zod
- Privyr webhook
- Resend email API

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` and the local API proxy runs on `http://localhost:3000`.

## Build

```bash
npm run build
```

The production bundle is generated in `dist/`.

## Deployment

### Vercel

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add these server-side environment variables:
   - `PRIVYR_WEBHOOK_URL`
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `FROM_EMAIL`
   - `SITE_NAME`
4. Deploy.

`/api/submit-lead` is handled by [`api/submit-lead.ts`](api/submit-lead.ts).

### cPanel

1. Run `npm run build`.
2. Upload the contents of `dist/` into `public_html/`.
3. Make sure [`dist/.htaccess`](dist/.htaccess) is present at `public_html/.htaccess`.
4. Make sure `public_html/api/submit-lead.php` exists.
   The build already copies [`public/api/submit-lead.php`](public/api/submit-lead.php) into `dist/api/submit-lead.php`.
5. Create `public_html/.env` with:
   - `PRIVYR_WEBHOOK_URL`
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `FROM_EMAIL`
   - `SITE_NAME`
6. If your host does not rewrite `/api/submit-lead`, set `VITE_FORM_ENDPOINT=/api/submit-lead.php` before running `npm run build`.

The cPanel endpoint calls Privyr first, then sends both Resend emails through the Resend HTTP API. It does not require Composer on the live server.

## Environment Variables

| Variable | Where Used | Description |
| --- | --- | --- |
| `PRIVYR_WEBHOOK_URL` | Server-side only | Privyr CRM webhook URL |
| `RESEND_API_KEY` | Server-side only | Resend API key |
| `ADMIN_EMAIL` | Server-side only | Admin inbox for lead alerts |
| `FROM_EMAIL` | Server-side only | Verified Resend sender |
| `SITE_NAME` | Server-side only | Company name used in emails |
| `VITE_FORM_ENDPOINT` | Client-side optional | Explicit form endpoint override |

## Project Structure

```text
api/                    Vercel serverless functions
cpanel/api/             cPanel PHP endpoint source
public/api/             PHP endpoint copied into dist on build
shared/                 Shared schemas and content
src/                    React application
dist/                   Build output
```
