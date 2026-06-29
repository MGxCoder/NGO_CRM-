
  # Untitled

  This is a code bundle for Untitled. The original project is available at https://www.figma.com/design/dTX9WDB6UO2J3g3pn7JbUU/Untitled.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Supabase server setup

  This project now includes a Supabase Edge Function sample and server-side SDK support.

  1. Copy `.env.local.example` to `.env.local` and populate the values from your Supabase Connect dialog.
  2. Make sure the following env vars are set in `.env.local`:
     - `SUPABASE_URL`
     - `SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_SECRET_KEY`
     - `SUPABASE_JWKS_URL`
  3. The sample function is located at `supabase/functions/campaigns.ts` and uses `withSupabase` from `@supabase/server`.
  4. If you are using non-`user` auth modes for local development, set `verify_jwt = false` in `supabase/config.toml`.
  