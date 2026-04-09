# Deployment Notes

## Vercel Environment Variables

Tambahkan environment variable berikut di Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

## Supabase Setup

1. Buka SQL Editor di Supabase.
2. Jalankan file `supabase/setup.sql`.
3. Pastikan bucket storage `menu-images` sudah tersedia dan public.

## Image Configuration

Project ini sudah mengizinkan domain Supabase Storage melalui `next.config.ts`.

## Notes

- Upload gambar admin tetap menggunakan Supabase Storage.
- Frontend dan admin membaca data live dari Supabase.
- Untuk produksi yang lebih aman, disarankan mengganti `SUPABASE_ANON_KEY` server-side dengan `SUPABASE_SERVICE_ROLE_KEY` untuk operasi admin yang sensitif.
