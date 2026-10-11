# Grind Coffee

A premium coffee shop website and private content dashboard built with Next.js App Router. The public website server-renders live content; the owner can edit menu items, prices, images, testimonials, and business details from `/admin`.

## Local preview

The app works with the included PostgreSQL connection. Run `npx drizzle-kit push` to create the tables, then `npm run dev`. If no owner exists, visit `/admin/login` to create the first local owner account. If an owner already exists, **sign in with that account's original email and password**. Local photos upload to `public/uploads` (use Supabase Storage for persistent production uploads).

## Supabase configuration

There are two independent steps:

1. **Open the private dashboard with Supabase Auth.** Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable key), plus `ADMIN_EMAIL` set to the exact owner email. In Supabase Dashboard → Authentication → Users, create/invite a user with **that same email and a password**. Then sign in at `/admin/login`. **No service-role key is needed just to authenticate and open the dashboard.** Setting `ADMIN_EMAIL` alone does not create a user or a password. If `ADMIN_EMAIL` is blank, only the email of an existing local preview owner is allowed for Supabase sign-in. The existing local owner can also continue using their original local password.
2. **Store and edit content in Supabase.** Run `supabase/schema.sql` in Supabase SQL Editor. Set `SUPABASE_SERVICE_ROLE_KEY` on the server (never `NEXT_PUBLIC_`). Without this key, the website and dashboard use local PostgreSQL content, even if you sign in with Supabase Auth. With it, content and uploads use Supabase tables and the `grind-media` storage bucket. Starter content is inserted on first load.

Keep `DATABASE_URL` configured for the local preview and the one-time login-form challenge. The service-role key never reaches the browser. Dashboard write actions validate the owner session on the server.
