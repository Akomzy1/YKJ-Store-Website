-- ─── YKJ African & Caribbean Food Store — Database Schema ────────────────────
-- Migration 001: Full schema, RLS policies, and triggers.
-- Run this in your Supabase SQL editor or via the Supabase CLI.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Enum types ───────────────────────────────────────────────────────────────

create type order_status as enum (
  'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create type delivery_method as enum (
  'standard', 'express', 'click_and_collect'
);

create type weight_unit as enum (
  'g', 'kg', 'ml', 'L', 'each', 'pack'
);

create type promo_type as enum (
  'percentage', 'fixed'
);

-- ─── categories ───────────────────────────────────────────────────────────────

create table categories (
  id         uuid        primary key default uuid_generate_v4(),
  name       text        not null,
  slug       text        not null unique,
  image_url  text,
  parent_id  uuid        references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_categories_slug on categories(slug);

-- ─── products ─────────────────────────────────────────────────────────────────

create table products (
  id           uuid          primary key default uuid_generate_v4(),
  name         text          not null,
  slug         text          not null unique,
  description  text          not null default '',
  price        numeric(10,2) not null check (price >= 0),
  sale_price   numeric(10,2)           check (sale_price is null or sale_price >= 0),
  category_id  uuid          not null references categories(id) on delete restrict,
  category     text          not null default '',  -- denormalized for display
  origin       text,
  brand        text,
  images       text[]        not null default '{}',
  stock_qty    integer       not null default 0 check (stock_qty >= 0),
  weight       numeric(10,3),
  unit         weight_unit,
  is_featured  boolean       not null default false,
  is_deal      boolean       not null default false,
  deal_ends_at timestamptz,
  is_halal     boolean       not null default false,
  is_vegan     boolean       not null default false,
  created_at   timestamptz   not null default now()
);

create index idx_products_slug         on products(slug);
create index idx_products_category_id  on products(category_id);
create index idx_products_is_featured  on products(is_featured) where is_featured = true;
create index idx_products_is_deal      on products(is_deal)     where is_deal     = true;
create index idx_products_origin       on products(origin);

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- Extends auth.users; auto-populated by handle_new_user() trigger.

create table profiles (
  id               uuid        primary key references auth.users(id) on delete cascade,
  full_name        text        not null default '',
  email            text        not null default '',
  phone            text,
  default_address  jsonb,
  marketing_opt_in boolean     not null default false,
  is_admin         boolean     not null default false,
  created_at       timestamptz not null default now()
);

-- ─── orders ───────────────────────────────────────────────────────────────────

create table orders (
  id                uuid          primary key default uuid_generate_v4(),
  user_id           uuid          not null references auth.users(id) on delete restrict,
  status            order_status  not null default 'pending',
  delivery_method   delivery_method not null default 'standard',
  subtotal          numeric(10,2) not null default 0,
  delivery_cost     numeric(10,2) not null default 0,
  discount          numeric(10,2) not null default 0,
  total             numeric(10,2) not null default 0,
  delivery_address  jsonb         not null default '{}',
  payment_intent_id text          not null default '',
  promo_code        text,
  notes             text,
  created_at        timestamptz   not null default now()
);

create index idx_orders_user_id    on orders(user_id);
create index idx_orders_status     on orders(status);
create index idx_orders_created_at on orders(created_at desc);

-- ─── order_items ──────────────────────────────────────────────────────────────

create table order_items (
  id            uuid          primary key default uuid_generate_v4(),
  order_id      uuid          not null references orders(id) on delete cascade,
  product_id    uuid                       references products(id) on delete set null,
  product_name  text          not null,
  product_image text          not null default '',
  quantity      integer       not null check (quantity > 0),
  unit_price    numeric(10,2) not null check (unit_price >= 0),
  subtotal      numeric(10,2) not null check (subtotal >= 0)
);

create index idx_order_items_order_id   on order_items(order_id);
create index idx_order_items_product_id on order_items(product_id);

-- ─── reviews ──────────────────────────────────────────────────────────────────

create table reviews (
  id                   uuid        primary key default uuid_generate_v4(),
  product_id           uuid        not null references products(id) on delete cascade,
  user_id              uuid        not null references auth.users(id) on delete cascade,
  user_name            text        not null,
  rating               smallint    not null check (rating between 1 and 5),
  comment              text        not null default '',
  is_verified_purchase boolean     not null default false,
  created_at           timestamptz not null default now(),
  unique (product_id, user_id)
);

create index idx_reviews_product_id on reviews(product_id);

-- ─── wishlist_items ───────────────────────────────────────────────────────────

create table wishlist_items (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id uuid        not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_wishlist_user_id on wishlist_items(user_id);

-- ─── promo_codes ──────────────────────────────────────────────────────────────

create table promo_codes (
  id              uuid          primary key default uuid_generate_v4(),
  code            text          not null unique,
  type            promo_type    not null,
  value           numeric(10,2) not null check (value > 0),
  min_order_value numeric(10,2) not null default 0,
  max_uses        integer,
  uses            integer       not null default 0,
  expires_at      timestamptz,
  is_active       boolean       not null default true,
  created_at      timestamptz   not null default now()
);

create index idx_promo_codes_code on promo_codes(code);

-- ─────────────────────────────────────────────────────────────────────────────
-- Admin helper function
-- Returns true if the current authenticated user has is_admin = true.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-create profile on new user signup
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table categories     enable row level security;
alter table products       enable row level security;
alter table profiles       enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table reviews        enable row level security;
alter table wishlist_items enable row level security;
alter table promo_codes    enable row level security;

-- ── categories: public read, admin write ──────────────────────────────────────

create policy "categories: public read"
  on categories for select using (true);

create policy "categories: admin insert"
  on categories for insert with check (is_admin());

create policy "categories: admin update"
  on categories for update using (is_admin());

create policy "categories: admin delete"
  on categories for delete using (is_admin());

-- ── products: public read, admin write ────────────────────────────────────────

create policy "products: public read"
  on products for select using (true);

create policy "products: admin insert"
  on products for insert with check (is_admin());

create policy "products: admin update"
  on products for update using (is_admin());

create policy "products: admin delete"
  on products for delete using (is_admin());

-- ── profiles: own row + admin ─────────────────────────────────────────────────

create policy "profiles: user read own"
  on profiles for select
  using (auth.uid() = id or is_admin());

create policy "profiles: user update own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: admin update any"
  on profiles for update
  using (is_admin());

-- ── orders: own row + admin ───────────────────────────────────────────────────

create policy "orders: user read own"
  on orders for select
  using (auth.uid() = user_id or is_admin());

create policy "orders: user insert own"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "orders: admin update"
  on orders for update
  using (is_admin());

-- ── order_items: via parent order ─────────────────────────────────────────────

create policy "order_items: user read own"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or is_admin())
    )
  );

create policy "order_items: user insert own"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ── reviews: public read, own write ──────────────────────────────────────────

create policy "reviews: public read"
  on reviews for select using (true);

create policy "reviews: user insert"
  on reviews for insert with check (auth.uid() = user_id);

create policy "reviews: user update own"
  on reviews for update using (auth.uid() = user_id);

create policy "reviews: admin delete"
  on reviews for delete using (is_admin());

-- ── wishlist_items: own only ──────────────────────────────────────────────────

create policy "wishlist: user read own"
  on wishlist_items for select using (auth.uid() = user_id);

create policy "wishlist: user insert"
  on wishlist_items for insert with check (auth.uid() = user_id);

create policy "wishlist: user delete own"
  on wishlist_items for delete using (auth.uid() = user_id);

-- ── promo_codes: public read active codes, admin manage ──────────────────────

create policy "promo_codes: public read active"
  on promo_codes for select using (is_active = true);

create policy "promo_codes: admin insert"
  on promo_codes for insert with check (is_admin());

create policy "promo_codes: admin update"
  on promo_codes for update using (is_admin());

create policy "promo_codes: admin delete"
  on promo_codes for delete using (is_admin());
