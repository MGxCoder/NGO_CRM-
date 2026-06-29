-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─── Tenants ─────────────────────────────────────────────────────────────────
create table if not exists public.tenants (
  id   text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

-- ─── Helper: extract tenant_id from the authenticated user's JWT ──────────────
-- Prefers the tenant_id set at signup. Falls back to auth.uid() so that users
-- who signed up before tenant_id was added can still access their own data.
-- Returns '' for anon requests (no JWT).
create or replace function public.auth_tenant_id()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'tenant_id', ''),
    auth.uid()::text,
    ''
  )
$$;

-- ─── Trigger: auto-create tenant row when a user signs up ────────────────────
create or replace function public.handle_new_user_tenant()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.raw_user_meta_data ->> 'tenant_id') is not null then
    insert into public.tenants (id, name)
    values (
      new.raw_user_meta_data ->> 'tenant_id',
      coalesce(new.raw_user_meta_data ->> 'org_name', 'My Organization')
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_tenant on auth.users;
create trigger on_auth_user_created_create_tenant
  after insert on auth.users
  for each row execute function public.handle_new_user_tenant();

-- ─── Core tables ─────────────────────────────────────────────────────────────
create table if not exists public.campaigns (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             text not null references public.tenants(id),
  name                  text not null,
  type                  text not null,
  status                text not null default 'Draft',
  goal_amount           numeric not null default 0,
  banner_url            text,
  description           text,
  organizer             text,
  event_date            date,
  registration_deadline date,
  end_date              date,
  donation_target       integer not null default 0,
  location              text,
  amount_raised         numeric not null default 0,
  source                text not null default 'Website',
  created_at            timestamptz not null default now()
);

create table if not exists public.campaign_registrations (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         text not null references public.tenants(id),
  campaign_id       uuid not null references public.campaigns(id) on delete cascade,
  name              text not null,
  email             text not null,
  phone             text,
  tickets           integer not null default 1,
  notes             text,
  confirmation_sent boolean not null default true,
  created_at        timestamptz not null default now()
);

create table if not exists public.campaign_donations (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references public.tenants(id),
  campaign_id    uuid not null references public.campaigns(id) on delete cascade,
  donor_name     text not null,
  donor_email    text not null,
  amount         numeric not null,
  payment_status text not null default 'paid',
  receipt_number text not null,
  source         text not null default 'Website',
  donation_type  text not null default 'One-time',
  created_at     timestamptz not null default now()
);

create table if not exists public.campaign_volunteers (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name        text not null,
  email       text not null,
  phone       text,
  notes       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.monthly_giving_subscriptions (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        text not null references public.tenants(id),
  donor_name       text not null,
  donor_email      text not null,
  amount           numeric not null,
  status           text not null default 'Active',
  payment_gateway  text not null default 'Stripe',
  next_charge_date date,
  auto_reminders   boolean not null default true,
  created_at       timestamptz not null default now()
);

create table if not exists public.major_gifts (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          text not null references public.tenants(id),
  donor_name         text not null,
  capacity_amount    numeric not null default 0,
  stage              text not null default 'Cultivation',
  next_step          text,
  last_gift_amount   numeric not null default 0,
  relationship_notes text,
  created_at         timestamptz not null default now()
);

create table if not exists public.direct_mail_campaigns (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references public.tenants(id),
  name           text not null,
  template       text not null,
  donor_segment  text not null,
  subject        text,
  body           text,
  scheduled_at   timestamptz,
  status         text not null default 'Draft',
  open_rate      numeric not null default 0,
  click_rate     numeric not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.crowdfunding_updates (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author      text not null default 'Team',
  body        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.crowdfunding_comments (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author      text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.campaign_ai_assets (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references public.tenants(id),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  asset_type  text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.donors (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              text not null references public.tenants(id),
  first_name             text not null,
  last_name              text not null,
  email                  text not null,
  phone                  text,
  country                text,
  city                   text,
  birthday               date,
  donation_frequency     text,
  preferred_communication text,
  interests              text,
  skills                 text,
  notes                  text,
  status                 text not null default 'Active',
  health_score           integer not null default 75,
  engagement_score       integer not null default 70,
  last_donation_date     date,
  total_donations        numeric not null default 0,
  created_at             timestamptz not null default now()
);

create table if not exists public.impact_stories (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         text not null references public.tenants(id),
  title             text not null,
  description       text not null,
  program           text not null,
  beneficiaries     integer,
  location          text not null,
  date              date not null,
  status            text not null default 'Draft',
  image_url         text,
  metric1           text,
  metric2           text,
  metric3           text,
  total_cost        numeric,
  testimonial_name  text,
  testimonial_quote text,
  created_at        timestamptz not null default now()
);

-- ─── Enable RLS on every table ───────────────────────────────────────────────
alter table public.tenants                    enable row level security;
alter table public.campaigns                  enable row level security;
alter table public.campaign_registrations     enable row level security;
alter table public.campaign_donations         enable row level security;
alter table public.campaign_volunteers        enable row level security;
alter table public.monthly_giving_subscriptions enable row level security;
alter table public.major_gifts               enable row level security;
alter table public.direct_mail_campaigns     enable row level security;
alter table public.crowdfunding_updates      enable row level security;
alter table public.crowdfunding_comments     enable row level security;
alter table public.campaign_ai_assets        enable row level security;
alter table public.donors                    enable row level security;
alter table public.impact_stories            enable row level security;

-- ─── Drop ALL old policies (idempotent) ──────────────────────────────────────
do $$ declare
  r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ─── TENANTS ─────────────────────────────────────────────────────────────────
-- Each authenticated user sees only their own org row.
create policy "tenants: own org read" on public.tenants
  for select to authenticated
  using (id = public.auth_tenant_id());

-- Allow each user to create their own tenant row on first login.
create policy "tenants: own org insert" on public.tenants
  for insert to authenticated
  with check (id = public.auth_tenant_id());

-- ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
-- Anon can read any campaign (needed for public /campaign/:id landing pages).
-- Authenticated users can only see / mutate their own tenant's campaigns.
create policy "campaigns: anon read" on public.campaigns
  for select to anon using (true);

create policy "campaigns: own tenant read" on public.campaigns
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "campaigns: own tenant insert" on public.campaigns
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "campaigns: own tenant update" on public.campaigns
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

create policy "campaigns: own tenant delete" on public.campaigns
  for delete to authenticated
  using (tenant_id = public.auth_tenant_id());

-- ─── CAMPAIGN REGISTRATIONS ──────────────────────────────────────────────────
create policy "registrations: own tenant read" on public.campaign_registrations
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "registrations: own tenant insert" on public.campaign_registrations
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── CAMPAIGN DONATIONS ──────────────────────────────────────────────────────
create policy "donations: own tenant read" on public.campaign_donations
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "donations: own tenant insert" on public.campaign_donations
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── CAMPAIGN VOLUNTEERS ─────────────────────────────────────────────────────
create policy "volunteers: own tenant read" on public.campaign_volunteers
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "volunteers: own tenant insert" on public.campaign_volunteers
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── MONTHLY GIVING ──────────────────────────────────────────────────────────
create policy "monthly giving: own tenant read" on public.monthly_giving_subscriptions
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "monthly giving: own tenant insert" on public.monthly_giving_subscriptions
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "monthly giving: own tenant update" on public.monthly_giving_subscriptions
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

-- ─── MAJOR GIFTS ─────────────────────────────────────────────────────────────
create policy "major gifts: own tenant read" on public.major_gifts
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "major gifts: own tenant insert" on public.major_gifts
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "major gifts: own tenant update" on public.major_gifts
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

-- ─── DIRECT MAIL ─────────────────────────────────────────────────────────────
create policy "direct mail: own tenant read" on public.direct_mail_campaigns
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "direct mail: own tenant insert" on public.direct_mail_campaigns
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "direct mail: own tenant update" on public.direct_mail_campaigns
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

-- ─── CROWDFUNDING UPDATES ────────────────────────────────────────────────────
create policy "crowdfunding updates: own tenant read" on public.crowdfunding_updates
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "crowdfunding updates: own tenant insert" on public.crowdfunding_updates
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── CROWDFUNDING COMMENTS ───────────────────────────────────────────────────
create policy "crowdfunding comments: own tenant read" on public.crowdfunding_comments
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "crowdfunding comments: own tenant insert" on public.crowdfunding_comments
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── AI ASSETS ───────────────────────────────────────────────────────────────
create policy "ai assets: own tenant read" on public.campaign_ai_assets
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "ai assets: own tenant insert" on public.campaign_ai_assets
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

-- ─── DONORS ──────────────────────────────────────────────────────────────────
create policy "donors: own tenant read" on public.donors
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "donors: own tenant insert" on public.donors
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "donors: own tenant update" on public.donors
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

create policy "donors: own tenant delete" on public.donors
  for delete to authenticated
  using (tenant_id = public.auth_tenant_id());

-- ─── IMPACT STORIES ──────────────────────────────────────────────────────────
create policy "impact stories: own tenant read" on public.impact_stories
  for select to authenticated
  using (tenant_id = public.auth_tenant_id());

create policy "impact stories: own tenant insert" on public.impact_stories
  for insert to authenticated
  with check (tenant_id = public.auth_tenant_id());

create policy "impact stories: own tenant update" on public.impact_stories
  for update to authenticated
  using (tenant_id = public.auth_tenant_id())
  with check (tenant_id = public.auth_tenant_id());

create policy "impact stories: own tenant delete" on public.impact_stories
  for delete to authenticated
  using (tenant_id = public.auth_tenant_id());

-- ─── STORAGE: impact-stories bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('impact-stories', 'impact-stories', true)
on conflict (id) do nothing;

drop policy if exists "impact story images: public read"   on storage.objects;
drop policy if exists "impact story images: auth upload"   on storage.objects;
drop policy if exists "impact story images: auth delete"   on storage.objects;

-- Anyone can view images (they are linked from public impact story pages)
create policy "impact story images: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'impact-stories');

-- Only authenticated users can upload / delete
create policy "impact story images: auth upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'impact-stories');

create policy "impact story images: auth delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'impact-stories');
