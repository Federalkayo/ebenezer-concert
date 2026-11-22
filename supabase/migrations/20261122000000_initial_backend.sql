create extension if not exists pgcrypto;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 160),
  email text not null,
  normalized_email text not null unique,
  phone text,
  registration_reference text not null unique,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  constraint registrations_email_format check (email = trim(email) and position('@' in email) > 1),
  constraint registrations_normalized_email check (normalized_email = lower(trim(email)))
);

create index registrations_created_at_idx on public.registrations (created_at desc);
create index registrations_full_name_lower_idx on public.registrations (lower(full_name));

create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;
alter table public.admin_users enable row level security;

create policy "Authorized admins can read registrations"
  on public.registrations for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = (select auth.uid())));

create policy "Authorized admins can update check-in time"
  on public.registrations for update to authenticated
  using (exists (select 1 from public.admin_users a where a.id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.id = (select auth.uid())));

create policy "Users can verify their own admin authorization"
  on public.admin_users for select to authenticated
  using (id = (select auth.uid()));

revoke all on public.registrations from anon, authenticated;
grant all on public.registrations to service_role;
grant select on public.registrations to authenticated;
grant update (checked_in_at) on public.registrations to authenticated;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

comment on table public.registrations is 'Public signups are created only through the register-attendee Edge Function using service role.';
comment on table public.admin_users is 'Administrators are provisioned by trusted operators only; no client insert policy exists.';
