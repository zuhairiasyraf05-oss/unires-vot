# Next Steps and Open Questions

## What we have created (in the artifact directory)
- Full **Next.js** project skeleton under `unires-vot/` with:
  - `package.json` and required dependencies.
  - Supabase client (`lib/supabase.js`).
  - Auth utilities (`lib/auth.js`).
  - Placeholder HTML template for PDF reports (`lib/reportHtml.js`).
  - API routes for:
    - Login (`pages/api/auth/login.js`).
    - VOT add (`pages/api/vot/add.js`).
    - VOT auto‑payment (`pages/api/vot/autoPay.js`).
    - Tabung Amanah add (`pages/api/tabung/add.js`).
  - Supabase schema (`supabase_schema.sql`).
  - README with setup & deployment instructions.

## Remaining files to add
- `pages/api/akaun/add.js` – CRUD for **Akaun Amanah**.
- `pages/api/report/pdf.js` – Generate PDF using Puppeteer.
- `pages/api/ai/summary.js` – Call Google Gemini to generate a summary.
- `pages/api/admin/clear.js` – Endpoint to purge all tables (for a fresh start).

## Open Questions / Required Information
We need the following from you before we can finish and deploy the live app:

1. **Supabase Project**
   - Do you want us to create a new Supabase project for you, or will you provide the **SUPABASE_URL**, **SUPABASE_ANON_KEY**, and **SUPABASE_SERVICE_ROLE_KEY**?
2. **Google Gemini API Key**
   - Please provide the `GEMINI_API_KEY` (or confirm you will add it as a Vercel env var).
3. **GitHub Repository**
   - Should we create a **public GitHub repo** (e.g., `unires-vot`) and push the code there, or would you prefer to keep the repo private and provide a repo URL for us to push?
4. **Exact PDF Layout**
   - The current `generateReportHtml` is a simple placeholder. Please share the exact HTML/CSS (or a screenshot) that matches the Excel format you need, so we can replace the placeholder.
5. **Initial SUPER_ADMIN credentials**
   - Email and password for the admin user (or we can create a one‑time endpoint to register the admin).
6. **Auto‑payment month handling**
   - When the allocated budget does not cover a full 12 months, should we allow a custom `months` value in the request, or should the system automatically calculate the max possible months?

Once we have these details we can:
- Finalise the missing API endpoints.
- Run the Supabase SQL to create tables.
- Add the environment variables to Vercel.
- Deploy the project to Vercel and share the live URL for your review.
