-- ─── YKJ Store — Supabase Storage Buckets ────────────────────────────────────
-- Migration 002: Create public storage buckets and RLS policies.
-- Run AFTER 001_schema.sql (requires is_admin() function).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Create buckets ────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'product-images',
    'product-images',
    true,
    5242880,  -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'category-images',
    'category-images',
    true,
    5242880,  -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;

-- ── Storage RLS policies ──────────────────────────────────────────────────────

-- product-images: anyone can view
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- product-images: admin can upload
create policy "product-images: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin());

-- product-images: admin can update
create policy "product-images: admin update"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin());

-- product-images: admin can delete
create policy "product-images: admin delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin());

-- category-images: anyone can view
create policy "category-images: public read"
  on storage.objects for select
  using (bucket_id = 'category-images');

-- category-images: admin can upload
create policy "category-images: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'category-images' and is_admin());

-- category-images: admin can update
create policy "category-images: admin update"
  on storage.objects for update
  using (bucket_id = 'category-images' and is_admin());

-- category-images: admin can delete
create policy "category-images: admin delete"
  on storage.objects for delete
  using (bucket_id = 'category-images' and is_admin());
