# EBENEZER 2026

React, Vite and Tailwind frontend with Supabase registration, administrator authentication, and a Resend confirmation email integration.

## Required configuration

Create a local `.env.local` file (never commit it) with:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The URL and Publishable key are public browser configuration. Copy the Publishable key from the default row under Supabase Dashboard → Project Settings → API Keys. Do not put a service role key or Resend API key in any `VITE_` variable or frontend file. For production, set these two variables in Vercel Project Settings → Environment Variables and redeploy.

## Database migration

Install the Supabase CLI and authenticate, then link the existing project and apply the migration:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The migration is `supabase/migrations/20261122000000_initial_backend.sql`. It creates `registrations` and `admin_users`, enables RLS, blocks public registration table writes and reads, allows authorized admins to read attendee records, and allows admins to update only check-in timestamps. The Edge Function uses the server-only service role to create public registrations.

## Edge Function and Resend

Set the function secrets in the linked Supabase project:

```sh
npx supabase secrets set RESEND_API_KEY=re_... RESEND_FROM_EMAIL="EBENEZER <registrations@your-verified-domain.example>" SITE_ORIGIN=https://your-site.example
npx supabase functions deploy register-attendee
```

Configure the sender domain in Resend before sending. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied to deployed Edge Functions by Supabase. The function inserts the registration first, then sends email; delivery errors remain recorded as `email_status = 'failed'` and in `email_error` without removing the registration. The public response includes the unique registration reference.

For local function development, create `supabase/.env` with the same Resend values and run:

```sh
npx supabase start
npx supabase functions serve register-attendee --env-file supabase/.env
```

Do not commit `supabase/.env` or paste secrets into frontend environment variables.

## Administrator setup

There is no public admin signup page. For each of the two administrators:

1. In Supabase Dashboard → Authentication → Users, create/invite the user with their email and password. Keep the resulting user UUID.
2. In SQL Editor, explicitly authorize that account (substitute its UUID and email):

   ```sql
   insert into public.admin_users (id, email)
   values ('AUTH_USER_UUID', 'admin@example.com');
   ```

Repeat for the second administrator. An authenticated user absent from `admin_users` is signed out and denied dashboard access. There is no client policy to insert or modify administrator records.

## Local development

```sh
npm install
npm run dev
```

The registration and admin data features require `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and deployed/local Supabase services above. Without configuration, those features show setup or connection errors; the app does not use demo credentials or seeded attendee records.

## Vercel deployment

Import the repository in Vercel and use the defaults (`npm run build`, output directory `dist`). Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under Project Settings → Environment Variables for the deployment environments, then redeploy. The Supabase Edge Function is deployed separately with the Supabase CLI. Ensure `SITE_ORIGIN` matches the public site origin and the Resend sender domain is verified.

## Verification

`npm run build` compiles TypeScript and builds the Vite production bundle. Live registration, email delivery, authentication, RLS behavior and CSV export require a configured Supabase project and Resend account; they are not simulated in this repository.
