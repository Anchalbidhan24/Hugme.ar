-- HUGME.AR Storefront — Supabase PostgreSQL Schema
-- Project Ref: cvujghhfccldlsuetwqi
-- Run this script once in your Supabase Dashboard -> SQL Editor:
-- https://supabase.com/dashboard/project/cvujghhfccldlsuetwqi/sql/new

-- 1. Orders table (captures customer, shipping, totals, gift wrap, note, loyalty & items)
create table if not exists public.orders (
  id text primary key,
  customer_id text not null default 'guest',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  payment_method text not null check (payment_method in ('Cash on Delivery', 'Online Payment')),
  status text not null default 'Pending' check (
    status in (
      'Pending',
      'Confirmed',
      'Packed with Love',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Refunded'
    )
  ),
  subtotal numeric not null default 0,
  gift_wrap_fee numeric not null default 0,
  coupon_code text,
  discount numeric not null default 0,
  loyalty_reward_id text,
  loyalty_reward_title text,
  loyalty_points_redeemed integer not null default 0,
  loyalty_discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  gift_wrap_name text,
  gift_wrap_price numeric,
  gift_card_design text,
  gift_recipient_name text,
  gift_sender_name text,
  gift_message text,
  items jsonb not null default '[]'::jsonb,
  tracking_steps jsonb not null default '[]'::jsonb,
  order_date text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_customer_email on public.orders (lower(customer_email));

-- 2. Relational order line items table
create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  image text,
  color text not null default '',
  size text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price numeric not null default 0,
  item_type text not null default 'product',
  bundle_items jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- 3. Customer Contact Us enquiries
create table if not exists public.enquiries (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Replied')),
  enquiry_date text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);

-- 4. Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id text primary key,
  email text not null unique,
  source text not null default 'Homepage Newsletter',
  subscribed_date text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (service_role bypasses RLS automatically; policies below allow anon key via server proxy)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.enquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "hugmear_orders_select" on public.orders;
create policy "hugmear_orders_select" on public.orders
  for select to anon, authenticated using (true);

drop policy if exists "hugmear_orders_insert" on public.orders;
create policy "hugmear_orders_insert" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "hugmear_orders_update" on public.orders;
create policy "hugmear_orders_update" on public.orders
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "hugmear_order_items_select" on public.order_items;
create policy "hugmear_order_items_select" on public.order_items
  for select to anon, authenticated using (true);

drop policy if exists "hugmear_order_items_insert" on public.order_items;
create policy "hugmear_order_items_insert" on public.order_items
  for insert to anon, authenticated with check (true);

drop policy if exists "hugmear_enquiries_select" on public.enquiries;
create policy "hugmear_enquiries_select" on public.enquiries
  for select to anon, authenticated using (true);

drop policy if exists "hugmear_enquiries_insert" on public.enquiries;
create policy "hugmear_enquiries_insert" on public.enquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "hugmear_enquiries_update" on public.enquiries;
create policy "hugmear_enquiries_update" on public.enquiries
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "hugmear_subscribers_select" on public.newsletter_subscribers;
create policy "hugmear_subscribers_select" on public.newsletter_subscribers
  for select to anon, authenticated using (true);

drop policy if exists "hugmear_subscribers_insert" on public.newsletter_subscribers;
create policy "hugmear_subscribers_insert" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
