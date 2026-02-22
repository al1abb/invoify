[![Discord](https://img.shields.io/badge/Discord-%40Invoify-000000?style=flat&logo=Discord&logoColor=#5865F2)](https://discord.gg/uhXKHbVKHZ)
# Invoify

Invoify is a web-based invoice generator application built with Next.js 13, TypeScript, React, and the Shadcn UI library. It provides an easy way to create and manage professional invoices.

![Invoify Website image](/public/assets/img/invoify-web-app.png)

## Table of Contents

- [Invoify](#invoify)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
    - [Core Technologies](#core-technologies)
    - [Additional Dependencies](#additional-dependencies)
  - [Roadmap](#roadmap)
  - [Demo](#demo)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [License](#license)


## Technologies

### Core Technologies

- **Next.js:** React framework for SSR and client-side navigation.
- **TypeScript:** JavaScript superset with static typing.
- **Shadcn-UI:** UI library for enhanced visuals.
- **Tailwind:** Utility-first CSS framework.
- **React Hook Form:** Form management for React.
- **Zod:** TypeScript-first schema validation.
- **Puppeteer:** PDF generation with headless browsers.

### Additional Dependencies

- **Nodemailer:** Node.js module for sending emails.
- **Lucide Icons:** Collection of customizable SVG icons.

## Roadmap

- [x] **Easily Create Invoices:** Utilize a simple form to quickly generate invoices.
- [x] **Save for Future Access:** Store your invoices directly in your browser for easy retrieval.
- [x] **Retrieve Invoices Effortlessly:** Load and access invoices seamlessly from your saved list.
- [x] **Flexible Download Options:** Download invoices directly or send them via email in PDF format.
- [x] **Template Variety:** Choose from multiple (currently 2) invoice templates.
- [x] **Live Preview:** Edit the form and see changes in real-time with the live preview feature.
- [x] **Export in Various Formats:** Export invoices in different formats, including JSON, CSV, and XML.
- [ ] **I18N Support:** i18n support with multiple languages for UI and templates.
- [ ] **Themeable Templates:** Select a theme color for the invoice
- [ ] **Custom Inputs:** Define your own inputs that are missing from the default invoice builder. (Ex: VAT number)
- [ ] **Individual Tax for Line Items:** Add tax details for a specific line item other than the general tax

## Demo

> [!NOTE]
> Please be advised that there are currently issues when using this application in the Mozilla Firefox browser. For more information, refer to [Issue #11](https://github.com/aliabb01/invoify/issues/11).

Visit the [live demo](https://invoify.vercel.app) to see Invoify in action.

## Getting Started

Follow these instructions to get Invoify up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/al1abb/invoify.git
   cd invoify
   ```
2. Install dependencies
   
   ```bash
   npm install
   ```
3. Create an `.env.local` file with this content (required only for "Send PDF to Email"):
   ```env
   NODEMAILER_EMAIL=your_email@example.com
   NODEMAILER_PW=your_gmail_app_password
   NEXT_PUBLIC_INVOICE_SYNC_PROVIDER=local
   NEXT_PUBLIC_SYNC_DEBOUNCE_MS=5000
   NEXT_PUBLIC_SYNC_MAX_INVOICES=250
   NEXT_PUBLIC_SYNC_MAX_TEMPLATES=100
   NEXT_PUBLIC_SYNC_MAX_PAYLOAD_BYTES=524288
   NEXT_PUBLIC_SYNC_RETRY_MAX_ATTEMPTS=3
   NEXT_PUBLIC_SYNC_RETRY_BASE_DELAY_MS=1000
   ```
   `NODEMAILER_PW` should be a Gmail App Password, not your normal account password.
   PDF caching is browser-side only and does not require any environment variables.
   `NEXT_PUBLIC_INVOICE_SYNC_PROVIDER` is optional (`local` default, `noop-cloud` and `supabase-rest` supported).
   For `supabase-rest`, also set:
   `NEXT_PUBLIC_SYNC_INGEST_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Start development server

    ```bash
    npm run dev
    ```
5. Open your web browser and access the application at [http://localhost:3000](http://localhost:3000)

### Quality Checks

Run lint/build/e2e locally:

```bash
npm run lint
npm run build
npm run test:e2e
```

Before first e2e run, install Playwright browser binaries:

```bash
npx playwright install --with-deps chromium
```

## New in This Release

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
4. Deploy edge function:
   - `supabase functions deploy invoice-sync --no-verify-jwt=false`
5. Configure app env:
   - `NEXT_PUBLIC_INVOICE_SYNC_PROVIDER=supabase-rest`
   - `NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>`
   - `NEXT_PUBLIC_SYNC_INGEST_URL=https://<project-ref>.supabase.co/functions/v1/invoice-sync`
6. Important behavior:
   - Sync only runs for authenticated users.
   - Unauthenticated users stay fully local and sync attempts are skipped (telemetry event only).

## Local Data and Migration

- Draft key:
  - `invoify:invoiceDraft`
- Saved invoices:
  - Legacy key: `savedInvoices`
  - Current key: `invoify:savedInvoices:v2`
  - Migration runs automatically on read and is idempotent.
- Customer templates:
  - `invoify:customerTemplates:v1`
- Client telemetry:
  - `invoify:telemetry:v1`
- PDF cache (IndexedDB):
  - DB: `invoify-client-cache-v1`
  - Store: `pdfs`

## Troubleshooting

- Clear only saved invoices:
  - Open browser devtools console and run:
  - `localStorage.removeItem('invoify:savedInvoices:v2')`
- Clear customer templates:
  - `localStorage.removeItem('invoify:customerTemplates:v1')`
- Clear draft form:
  - `localStorage.removeItem('invoify:invoiceDraft')`
- Clear legacy invoices key:
  - `localStorage.removeItem('savedInvoices')`
- Clear PDF cache:
  - In devtools Application tab, delete IndexedDB `invoify-client-cache-v1`.
- Clear telemetry events:
  - `localStorage.removeItem('invoify:telemetry:v1')`
- Full local reset:
  - Clear all related localStorage keys above and remove the IndexedDB database.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Discord
Join the Discord server [here](https://discord.gg/uhXKHbVKHZ)
