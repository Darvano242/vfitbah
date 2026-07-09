# VFITNESS Bahamas — Supabase + GitHub + Vercel migration kit

Live app: vfitbah.com (currently Netlify + Firebase). This repo is the full
migration package. The app in `site/` is byte-identical to production except
the three Netlify config files are replaced by `site/vercel.json`.

## Repo layout

```
site/                          the PWA, Vercel-ready (vercel.json included)
supabase/schema.sql            39 tables, 127 RLS policies — validated on Postgres 16
supabase/migrate-firestore.mjs Firestore -> Supabase data migration (all 38 collections)
```

## 1. GitHub (2 minutes)

Repo is already initialized and committed. From this folder:

```bash
git remote add origin https://github.com/Darvano242/vfitbah.git
git push -u origin main
```

(Create the empty repo at github.com/new first — no README, no license.)

## 2. Vercel (3 minutes)

1. vercel.com → Add New → Project → Import `Darvano242/vfitbah`
2. **Root Directory: `site`** — this is the only setting that matters
3. Framework preset: Other. Build command: none. Output: `.`
4. Deploy. Every future `git push` auto-deploys.

The app keeps running on Firebase exactly as it does today, so this Vercel
deployment is production-equivalent from minute one. Point vfitbah.com DNS at
Vercel only after you have clicked through login, packages, and PayPal on the
`.vercel.app` URL. Keep Netlify alive until then — instant rollback.

## 3. Supabase

**a. Schema** — DONE (2026-07-09): applied live to Supabase project
`hxpsbhhkemccmmrukhji` (name: vfitness, us-east-1, $0/month) as three
migrations. Verified: 39 tables, 130 RLS policies, 0 tables without RLS.
Project URL and publishable key are in `supabase/.env.example`.

**b. Auth users** — Firebase password hashes (scrypt) can be imported so
nobody has to reset a password. Follow the official guide:
https://supabase.com/docs/guides/platform/migrating-to-supabase/firebase-auth
You will need the scrypt parameters from Firebase Console → Authentication →
Users → three-dot menu → Password hash parameters.

**c. Data** —
```bash
npm i firebase-admin @supabase/supabase-js
export GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
export SUPABASE_URL=https://hxpsbhhkemccmmrukhji.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<service role key>
node supabase/migrate-firestore.mjs
```

**d. Link auth to profiles** — SQL Editor: `select public.link_profiles();`

## 4. Runtime cutover (the honest part)

`site/index.html` still talks to Firebase. That is deliberate: switching the
runtime before steps 3a–3d complete would ship a live app with empty data and
broken logins. Once the data is verified in Supabase, the runtime swap is a
contained change — the app touches Firebase through exactly one surface
(`auth`, `db`, `storage` at the top of the bundle), so a Supabase adapter
replaces it in one commit without touching the 38 feature areas.

## Schema design

- Every Firestore collection is a JSONB document table with promoted columns:
  `firestore_id`, `client_uid`, `trainer_uid`, `data`, timestamps. Nothing is
  lost in translation; hot fields can be promoted to real columns later with
  `alter table` + backfill from `data`.
- RLS mirrors the app's actual role model (`client` / `trainer` / `admin`
  found in the code): clients see their own rows, trainers see their clients,
  staff manages catalog content, `publiccoachingapplications` accepts inserts
  from anyone, `packageauditlog` is staff-only.
- Firebase UIDs are preserved as `client_uid` / `trainer_uid` text columns and
  bridged to Supabase auth through `profiles.firebase_uid` — no ID rewriting
  across 38 tables.
