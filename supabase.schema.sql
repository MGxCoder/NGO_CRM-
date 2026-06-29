create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.tenants (id, name)
values
  ('default', 'Cre8Gre8 Global'),
  ('north-region', 'Cre8Gre8 North Region'),
  ('south-region', 'Cre8Gre8 South Region')
on conflict (id) do nothing;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  name text not null,
  type text not null,
  status text not null default 'Draft',
  goal_amount numeric not null default 0,
  banner_url text,
  description text,
  organizer text,
  event_date date,
  registration_deadline date,
  end_date date,
  donation_target integer not null default 0,
  location text,
  amount_raised numeric not null default 0,
  source text not null default 'Website',
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_registrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  tickets integer not null default 1,
  notes text,
  confirmation_sent boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_donations (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  donor_name text not null,
  donor_email text not null,
  amount numeric not null,
  payment_status text not null default 'paid',
  receipt_number text not null,
  source text not null default 'Website',
  donation_type text not null default 'One-time',
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_volunteers (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.monthly_giving_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  donor_name text not null,
  donor_email text not null,
  amount numeric not null,
  status text not null default 'Active',
  payment_gateway text not null default 'Stripe',
  next_charge_date date,
  auto_reminders boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.major_gifts (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  donor_name text not null,
  capacity_amount numeric not null default 0,
  stage text not null default 'Cultivation',
  next_step text,
  last_gift_amount numeric not null default 0,
  relationship_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.direct_mail_campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  name text not null,
  template text not null,
  donor_segment text not null,
  subject text,
  body text,
  scheduled_at timestamptz,
  status text not null default 'Draft',
  open_rate numeric not null default 0,
  click_rate numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.crowdfunding_updates (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author text not null default 'Cre8Gre8 Team',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crowdfunding_comments (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_ai_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  asset_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;
alter table public.tenants enable row level security;
alter table public.campaign_registrations enable row level security;
alter table public.campaign_donations enable row level security;
alter table public.campaign_volunteers enable row level security;
alter table public.campaign_ai_assets enable row level security;
alter table public.monthly_giving_subscriptions enable row level security;
alter table public.major_gifts enable row level security;
alter table public.direct_mail_campaigns enable row level security;
alter table public.crowdfunding_updates enable row level security;
alter table public.crowdfunding_comments enable row level security;

alter table public.campaigns add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.campaign_registrations add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.campaign_donations add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.campaign_volunteers add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.campaign_ai_assets add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.monthly_giving_subscriptions add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.major_gifts add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.direct_mail_campaigns add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.crowdfunding_updates add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.crowdfunding_comments add column if not exists tenant_id text not null default 'default' references public.tenants(id);
alter table public.campaigns add column if not exists end_date date;
alter table public.campaign_donations add column if not exists donation_type text not null default 'One-time';

drop policy if exists "tenants are readable" on public.tenants;
drop policy if exists "campaigns are readable" on public.campaigns;
drop policy if exists "campaigns are insertable" on public.campaigns;
drop policy if exists "campaigns are updatable" on public.campaigns;
drop policy if exists "campaigns are deletable" on public.campaigns;
drop policy if exists "registrations are readable" on public.campaign_registrations;
drop policy if exists "registrations are insertable" on public.campaign_registrations;
drop policy if exists "donations are readable" on public.campaign_donations;
drop policy if exists "donations are insertable" on public.campaign_donations;
drop policy if exists "volunteers are readable" on public.campaign_volunteers;
drop policy if exists "volunteers are insertable" on public.campaign_volunteers;
drop policy if exists "ai assets are readable" on public.campaign_ai_assets;
drop policy if exists "ai assets are insertable" on public.campaign_ai_assets;
drop policy if exists "monthly giving is readable" on public.monthly_giving_subscriptions;
drop policy if exists "monthly giving is insertable" on public.monthly_giving_subscriptions;
drop policy if exists "monthly giving is updatable" on public.monthly_giving_subscriptions;
drop policy if exists "major gifts are readable" on public.major_gifts;
drop policy if exists "major gifts are insertable" on public.major_gifts;
drop policy if exists "major gifts are updatable" on public.major_gifts;
drop policy if exists "direct mail is readable" on public.direct_mail_campaigns;
drop policy if exists "direct mail is insertable" on public.direct_mail_campaigns;
drop policy if exists "direct mail is updatable" on public.direct_mail_campaigns;
drop policy if exists "crowdfunding updates are readable" on public.crowdfunding_updates;
drop policy if exists "crowdfunding updates are insertable" on public.crowdfunding_updates;
drop policy if exists "crowdfunding comments are readable" on public.crowdfunding_comments;
drop policy if exists "crowdfunding comments are insertable" on public.crowdfunding_comments;

-- Policies cover both anon (public-facing forms) and authenticated (dashboard users)
create policy "tenants are readable" on public.tenants
  for select to anon, authenticated using (true);

create policy "campaigns are readable" on public.campaigns
  for select to anon, authenticated using (true);
create policy "campaigns are insertable" on public.campaigns
  for insert to anon, authenticated with check (true);
create policy "campaigns are updatable" on public.campaigns
  for update to anon, authenticated using (true) with check (true);
create policy "campaigns are deletable" on public.campaigns
  for delete to anon, authenticated using (true);

create policy "registrations are readable" on public.campaign_registrations
  for select to anon, authenticated using (true);
create policy "registrations are insertable" on public.campaign_registrations
  for insert to anon, authenticated with check (true);

create policy "donations are readable" on public.campaign_donations
  for select to anon, authenticated using (true);
create policy "donations are insertable" on public.campaign_donations
  for insert to anon, authenticated with check (true);

create policy "volunteers are readable" on public.campaign_volunteers
  for select to anon, authenticated using (true);
create policy "volunteers are insertable" on public.campaign_volunteers
  for insert to anon, authenticated with check (true);

create policy "ai assets are readable" on public.campaign_ai_assets
  for select to anon, authenticated using (true);
create policy "ai assets are insertable" on public.campaign_ai_assets
  for insert to anon, authenticated with check (true);

create policy "monthly giving is readable" on public.monthly_giving_subscriptions
  for select to anon, authenticated using (true);
create policy "monthly giving is insertable" on public.monthly_giving_subscriptions
  for insert to anon, authenticated with check (true);
create policy "monthly giving is updatable" on public.monthly_giving_subscriptions
  for update to anon, authenticated using (true) with check (true);

create policy "major gifts are readable" on public.major_gifts
  for select to anon, authenticated using (true);
create policy "major gifts are insertable" on public.major_gifts
  for insert to anon, authenticated with check (true);
create policy "major gifts are updatable" on public.major_gifts
  for update to anon, authenticated using (true) with check (true);

create policy "direct mail is readable" on public.direct_mail_campaigns
  for select to anon, authenticated using (true);
create policy "direct mail is insertable" on public.direct_mail_campaigns
  for insert to anon, authenticated with check (true);
create policy "direct mail is updatable" on public.direct_mail_campaigns
  for update to anon, authenticated using (true) with check (true);

create policy "crowdfunding updates are readable" on public.crowdfunding_updates
  for select to anon, authenticated using (true);
create policy "crowdfunding updates are insertable" on public.crowdfunding_updates
  for insert to anon, authenticated with check (true);

create policy "crowdfunding comments are readable" on public.crowdfunding_comments
  for select to anon, authenticated using (true);
create policy "crowdfunding comments are insertable" on public.crowdfunding_comments
  for insert to anon, authenticated with check (true);

insert into public.campaigns (
  name,
  type,
  status,
  goal_amount,
  banner_url,
  description,
  organizer,
  event_date,
  registration_deadline,
  donation_target,
  location,
  amount_raised,
  source
)
values
  (
    'Run for Rural Classrooms',
    'Fundraising Event',
    'Live',
    85000,
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    'A community run funding classroom kits, digital learning corners, and teacher training for rural schools.',
    'Education Outreach Team',
    '2026-08-18',
    '2026-08-10',
    1200,
    'Austin Community Park',
    58240,
    'Social'
  ),
  (
    'Clean Water Giving Week',
    'Digital Appeal',
    'Scheduled',
    125000,
    'https://images.unsplash.com/photo-1541919329513-35f7af297129?auto=format&fit=crop&w=1400&q=80',
    'A week-long campaign to install community filtration units and train local water stewards.',
    'Field Programs',
    '2026-09-05',
    '2026-08-30',
    2000,
    'Online',
    31800,
    'Email'
  )
on conflict do nothing;

-- Donors
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  country text,
  city text,
  birthday date,
  donation_frequency text,
  preferred_communication text,
  interests text,
  skills text,
  notes text,
  status text not null default 'Active',
  health_score integer not null default 75,
  engagement_score integer not null default 70,
  last_donation_date date,
  total_donations numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.donors enable row level security;

drop policy if exists "donors are readable" on public.donors;
drop policy if exists "donors are insertable" on public.donors;
drop policy if exists "donors are updatable" on public.donors;
drop policy if exists "donors are deletable" on public.donors;

create policy "donors are readable" on public.donors
  for select to anon, authenticated using (true);
create policy "donors are insertable" on public.donors
  for insert to anon, authenticated with check (true);
create policy "donors are updatable" on public.donors
  for update to anon, authenticated using (true) with check (true);
create policy "donors are deletable" on public.donors
  for delete to anon, authenticated using (true);

-- Impact Stories
insert into storage.buckets (id, name, public)
values ('impact-stories', 'impact-stories', true)
on conflict (id) do nothing;

create table if not exists public.impact_stories (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default' references public.tenants(id),
  title text not null,
  description text not null,
  program text not null,
  beneficiaries integer,
  location text not null,
  date date not null,
  status text not null default 'Draft',
  image_url text,
  metric1 text,
  metric2 text,
  metric3 text,
  total_cost numeric,
  testimonial_name text,
  testimonial_quote text,
  created_at timestamptz not null default now()
);

alter table public.impact_stories enable row level security;

drop policy if exists "impact stories are readable" on public.impact_stories;
drop policy if exists "impact stories are insertable" on public.impact_stories;
drop policy if exists "impact stories are updatable" on public.impact_stories;
drop policy if exists "impact stories are deletable" on public.impact_stories;

create policy "impact stories are readable" on public.impact_stories
  for select to anon, authenticated using (true);
create policy "impact stories are insertable" on public.impact_stories
  for insert to anon, authenticated with check (true);
create policy "impact stories are updatable" on public.impact_stories
  for update to anon, authenticated using (true) with check (true);
create policy "impact stories are deletable" on public.impact_stories
  for delete to anon, authenticated using (true);

-- Storage policies for impact-stories bucket
drop policy if exists "impact story images are publicly readable" on storage.objects;
drop policy if exists "impact story images are uploadable" on storage.objects;

create policy "impact story images are publicly readable" on storage.objects
  for select to anon, authenticated using (bucket_id = 'impact-stories');
create policy "impact story images are uploadable" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'impact-stories');
