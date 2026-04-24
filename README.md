# Sunpilot Web

Professional booking and e-commerce website for a window blind company.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Supabase for auth, database, and storage

## Core Flows

- Public storefront with guest browsing
- Product detail pages
- Offline checkout with proof-of-payment upload
- Admin-only dashboard for:
  - creating products
  - editing prices and sale prices
  - listing and delisting products
  - toggling delivery states in Nigeria
  - reviewing and updating order statuses
  - updating the bank account shown during checkout

## Setup

1. Copy `.env.example` into `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the SQL in `supabase/schema.sql`.
4. Run the SQL in `supabase/seed.sql`.
5. Create an auth user in Supabase Authentication.
6. Insert that auth user into `public.admin_profiles`.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
