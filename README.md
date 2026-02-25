# Invoify

Invoify is a local-first invoice generator built with Next.js App Router, TypeScript, React, and Shadcn UI. It helps users create, save, export, and send invoices with optional cloud sync.

![Invoify Website image](/public/assets/img/invoify-web-app.png)

## Table of Contents

- [Invoify](#invoify)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Architecture](#architecture)
  - [Sync Behavior](#sync-behavior)
  - [Storage and Migration Notes](#storage-and-migration-notes)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Quality Checks](#quality-checks)
  - [Test Matrix](#test-matrix)
  - [Known Limits](#known-limits)
  - [License](#license)


## Technologies

- **Next.js 15 (App Router):** SSR + client navigation.
- **TypeScript:** JavaScript superset with static typing.
- **React + React Hook Form + Zod:** Form state and validation.
- **Shadcn UI + Tailwind CSS:** UI primitives and styling.
- **Puppeteer / Chromium:** Server-side PDF rendering.
- **Nodemailer:** Email delivery for generated PDFs.
- **Vitest + Playwright:** Unit/integration and end-to-end testing.

## Architecture

- `contexts/InvoiceContext.tsx`: top-level invoice orchestration (PDF actions, saved invoices, sync, export/email).
- `lib/storage/*`: browser persistence adapters with versioned envelopes and migration/corruption recovery paths.
- `app/api/invoice/*`: API route layer with shared request validation and normalized error payloads.
- `services/invoice/server/*`: route-independent business logic for PDF generation/export/email.
- `lib/sync/*`: optional cloud snapshot merge/push/pull logic and conflict resolution.

## Sync Behavior

- Local-first by default (`NEXT_PUBLIC_INVOICE_SYNC_PROVIDER=local`).
- Cloud sync is optional and auth-gated (for cloud providers).
- Sync snapshots are capped by record counts and payload size to reduce failures.
- Merge strategy is deterministic by `updatedAt` with conflict records surfaced in-app.

## Storage and Migration Notes

- Draft envelope: `invoify:invoiceDraft:v2` (legacy `invoify:invoiceDraft` auto-migrates).
- Saved invoices envelope: `invoify:savedInvoices:v3` (legacy `invoify:savedInvoices:v2` and `savedInvoices` auto-migrate).
- Customer templates envelope: `invoify:customerTemplates:v2` (legacy `invoify:customerTemplates:v1` auto-migrates).
- User preferences: `invoify:userPreferences:v1`.
- Migration/corruption telemetry events are emitted client-side.
- On unrecoverable JSON/shape corruption, the app stores a backup key (`invoify:backup:*`) and resets safely.

## Getting Started

Follow these instructions to get Invoify up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/g2mrnknjjx-alt/invoify
   cd invoify
   ```
2. Install dependencies
   
   ```bash
   npm install
   ```
3. Create an `.env.local` file with this content (required only for "Send PDF to Email"):
   ```env
   # Option A: full SMTP URL
   SMTP_URL=
   # Option B: explicit SMTP settings
   SMTP_HOST=
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM="Invoify <no-reply@example.com>"
   SMTP_FROM_NAME=
   SMTP_FROM_EMAIL=
   NEXT_PUBLIC_INVOICE_SYNC_PROVIDER=local
   NEXT_PUBLIC_SYNC_DEBOUNCE_MS=5000
   NEXT_PUBLIC_SYNC_MAX_INVOICES=250
   NEXT_PUBLIC_SYNC_MAX_TEMPLATES=100
   NEXT_PUBLIC_SYNC_MAX_PAYLOAD_BYTES=524288
   NEXT_PUBLIC_SYNC_RETRY_MAX_ATTEMPTS=3
   NEXT_PUBLIC_SYNC_RETRY_BASE_DELAY_MS=1000
   NEXT_PUBLIC_SENTRY_DSN=
   SENTRY_DSN=
   NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
   SENTRY_TRACES_SAMPLE_RATE=0.1
   # development locally, beta for beta deployments, production for production
   NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
   SENTRY_ENVIRONMENT=development
   # optional release identifier in Sentry
   SENTRY_RELEASE=
   ```
   Use either `SMTP_URL` or `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`.
   `SMTP_FROM` is optional. You can also set `SMTP_FROM_NAME` + `SMTP_FROM_EMAIL`.
   PDF caching is browser-side only and does not require any environment variables.
   `NEXT_PUBLIC_INVOICE_SYNC_PROVIDER` is optional (`local` default, `noop-cloud` and `supabase-rest` supported).
   For `supabase-rest`, also set:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   For Sentry source map uploads, also set:
   `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`.
   Recommended Sentry environment mapping:
   local `.env.local` => `development`,
   beta deployment => `beta` (for example `SENTRY_RELEASE=v0.3.0-beta.1`),
   production deployment => `production`.
4. Start development server

    ```bash
    npm run dev
    ```
5. Open your web browser and access the application at [http://localhost:3010](http://localhost:3010)

`npm run dev` now safely reuses port `3010` by stopping stale listeners first (prevents `EADDRINUSE` loops).  
If you want raw Next.js behavior without that safety wrapper, run:

```bash
npm run dev:raw
```

### Quality Checks

Run unit/lint/build/e2e locally:

```bash
npm run test:unit
npm run lint
npm run build
npm run test:e2e
```

Optional cloud-sync e2e test credentials:

```bash
E2E_SUPABASE_EMAIL=your_test_user@example.com
E2E_SUPABASE_PASSWORD=your_test_user_password
```

Before first e2e run, install Playwright browser binaries:

```bash
npx playwright install --with-deps chromium
```

### Test Matrix

- `npm run test:unit`
  - Storage migration/corruption recovery (draft, saved invoices, templates)
  - API contract validation and normalized error payloads
  - PDF filename sanitization/meta helpers
  - Sync merge/conflict default behavior
- `npm run lint`
  - ESLint checks for TS/React codebase
- `npm run build`
  - Next.js production build validation
- `npm run test:e2e`
  - Core user workflows and browser integration checks

## Known Limits

- The app is local-first; cloud sync is optional and currently snapshot-based.
- PDF cache is browser-local (IndexedDB) and is not synced to cloud providers.
- Email delivery requires valid SMTP configuration (`SMTP_URL` or host/port/user/pass).
- Aggregated saved-invoice insights are numeric totals and do not currently split by currency.

## New in This Release

- Production monitoring with Sentry:
  - Captures App Router render crashes, API/service exceptions, and client telemetry errors.
  - Uses `instrumentation.ts` / `instrumentation-client.ts` and `app/global-error.tsx`.
  - Fully optional: if DSN variables are unset, Sentry stays disabled.
- Faster startup optimizations:
  - Split shared helper module into client/server/currency helper files.
  - Lazy-loaded secondary action modals.
  - BuyMeACoffee widget now loads with `lazyOnload`.
  - Signature fonts are no longer preloaded on first render.
  - Draft form writes are debounced to reduce localStorage churn.
- PDF cache in browser IndexedDB:
  - Generated PDFs are cached by invoice number.
  - Cache retention removes entries older than 90 days.
  - Cache is capped at 100 PDFs (oldest by `updatedAt` are evicted first).
  - Saved invoice loader shows cached-PDF badge, size, and cache update time.
- Workflow features:
  - Duplicate saved invoice with unique number suffix (`-copy`, `-copy-2`, ...).
  - Invoice status tracking (`draft`, `sent`, `paid`).
  - Customer templates for sender/receiver with save/apply/rename/delete actions.
- Reliability and architecture:
  - Playwright smoke tests for invoice and template workflows.
  - ESLint CLI configuration and CI workflow for lint/build/e2e.
  - Lightweight client telemetry for runtime, PDF, and email failures.
  - Worker-first PDF generation request path with direct-fetch fallback.
  - Cloud-sync interface layer with `supabase-rest` option and free-plan guardrails.
  - Sync is debounced and deduplicated to reduce write volume.
  - Sync snapshots are capped by item count and payload size.
  - Cloud sync now pulls on authenticated sessions, merges local/cloud by `updatedAt`, and exposes a conflict-resolution modal when records diverge.

## Supabase Free-Plan Guardrails

- Keep `NEXT_PUBLIC_SYNC_DEBOUNCE_MS` at `5000` or higher.
- Keep retry conservative:
  - `NEXT_PUBLIC_SYNC_RETRY_MAX_ATTEMPTS=3`
  - `NEXT_PUBLIC_SYNC_RETRY_BASE_DELAY_MS=1000`
- Keep snapshot caps conservative:
  - `NEXT_PUBLIC_SYNC_MAX_INVOICES=250`
  - `NEXT_PUBLIC_SYNC_MAX_TEMPLATES=100`
- Keep payload guard enabled:
  - `NEXT_PUBLIC_SYNC_MAX_PAYLOAD_BYTES=524288` (512 KB)
- PDFs are not part of cloud snapshots; they remain browser-cached locally.
- If payload exceeds guard limit, sync is skipped and logged to telemetry instead of spamming failed writes.

## Supabase Setup (Authenticated Sync)

1. Install Supabase CLI (if needed) and login:
   - `brew install supabase/tap/supabase`
   - `supabase login`
2. Initialize/local-link project:
   - `supabase init`
   - `supabase link --project-ref <your-project-ref>`
3. Apply migration:
   - `supabase db push`
4. Configure app env:
   - `NEXT_PUBLIC_INVOICE_SYNC_PROVIDER=supabase-rest`
   - `NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>`
5. Important behavior:
   - Sync only runs for authenticated users.
   - Sync writes directly to `public.invoice_sync_snapshots` through Supabase RLS.
   - Unauthenticated users stay fully local and sync attempts are skipped (telemetry event only).
   - Use the top-right `Sign In` button in the app navbar to authenticate with Supabase Auth.

## Local Data and Migration

- Draft:
  - Current key: `invoify:invoiceDraft:v2`
  - Legacy key: `invoify:invoiceDraft`
- Saved invoices:
  - Legacy key: `savedInvoices`
  - Mid key: `invoify:savedInvoices:v2`
  - Current key: `invoify:savedInvoices:v3`
  - Migration runs automatically on read and is idempotent.
- Customer templates:
  - Legacy key: `invoify:customerTemplates:v1`
  - Current key: `invoify:customerTemplates:v2`
- User preferences:
  - `invoify:userPreferences:v1`
- Client telemetry:
  - `invoify:telemetry:v1`
- Corruption backups:
  - `invoify:backup:*`
- PDF cache (IndexedDB):
  - DB: `invoify-client-cache-v1`
  - Store: `pdfs`

## Troubleshooting

- Clear only saved invoices:
  - Open browser devtools console and run:
  - `localStorage.removeItem('invoify:savedInvoices:v3')`
- Clear customer templates:
  - `localStorage.removeItem('invoify:customerTemplates:v2')`
- Clear draft form:
  - `localStorage.removeItem('invoify:invoiceDraft:v2')`
- Clear user preferences:
  - `localStorage.removeItem('invoify:userPreferences:v1')`
- Clear legacy invoices key:
  - `localStorage.removeItem('savedInvoices')`
- Clear PDF cache:
  - In devtools Application tab, delete IndexedDB `invoify-client-cache-v1`.
- Clear telemetry events:
  - `localStorage.removeItem('invoify:telemetry:v1')`
- Full local reset:
  - Clear all related localStorage keys above and remove the IndexedDB database.
- Sentry disabled unexpectedly:
  - Verify `NEXT_PUBLIC_SENTRY_DSN` (browser) and/or `SENTRY_DSN` (server) are set.
  - Rebuild after changing env variables (`npm run build`).

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
