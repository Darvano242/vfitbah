-- =============================================================
-- VFITNESS BAHAMAS  |  Supabase schema  |  generated 2026-07-09
-- Source of truth: vfitbah.com index.html (Firestore usage map)
-- Pattern: JSONB document tables with promoted hot columns.
-- Firebase UIDs are preserved as text; Supabase auth users link
-- through public.profiles.firebase_uid after auth import.
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- profiles (Firestore: users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  firebase_uid text unique,
  name text,
  email text,
  phone text,
  role text not null default 'client' check (role in ('client','user','trainer','admin')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Staging table for Firestore user docs imported BEFORE auth import
create table if not exists public.profiles_staging (
  firebase_uid text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- helpers ----------
create or replace function public.fb_uid() returns text
language sql stable security definer set search_path = public as
$$ select firebase_uid from public.profiles where id = auth.uid() $$;

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(public.my_role() in ('trainer','admin'), false) $$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;

-- After Supabase Auth import, link auth users to imported Firestore docs:
create or replace function public.link_profiles() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into public.profiles (id, firebase_uid, name, email, phone, role, data, created_at)
  select u.id, s.firebase_uid,
         s.data->>'name', coalesce(u.email, s.data->>'email'),
         s.data->>'phone', coalesce(s.data->>'role','client'), s.data,
         coalesce((s.data->>'createdAt')::timestamptz, now())
  from public.profiles_staging s
  join auth.users u on lower(u.email) = lower(s.data->>'email')
  on conflict (id) do update set
    firebase_uid = excluded.firebase_uid,
    name = excluded.name, phone = excluded.phone,
    role = excluded.role, data = excluded.data;
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------- packages (client) ----------
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists packages_client_idx on public.packages (client_uid);
create index if not exists packages_trainer_idx on public.packages (trainer_uid);
create index if not exists packages_data_gin on public.packages using gin (data);
create trigger packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();
alter table public.packages enable row level security;
create policy "packages_owner_select" on public.packages for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packages_owner_insert" on public.packages for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "packages_owner_update" on public.packages for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packages_staff_delete" on public.packages for delete using (public.is_staff());

-- ---------- workoutProgramEnrollments (client) ----------
create table if not exists public.workoutProgramEnrollments (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workoutProgramEnrollments_client_idx on public.workoutProgramEnrollments (client_uid);
create index if not exists workoutProgramEnrollments_trainer_idx on public.workoutProgramEnrollments (trainer_uid);
create index if not exists workoutProgramEnrollments_data_gin on public.workoutProgramEnrollments using gin (data);
create trigger workoutProgramEnrollments_touch before update on public.workoutProgramEnrollments
  for each row execute function public.touch_updated_at();
alter table public.workoutProgramEnrollments enable row level security;
create policy "workoutProgramEnrollments_owner_select" on public.workoutProgramEnrollments for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "workoutProgramEnrollments_owner_insert" on public.workoutProgramEnrollments for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "workoutProgramEnrollments_owner_update" on public.workoutProgramEnrollments for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "workoutProgramEnrollments_staff_delete" on public.workoutProgramEnrollments for delete using (public.is_staff());

-- ---------- workoutLogs (client) ----------
create table if not exists public.workoutLogs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workoutLogs_client_idx on public.workoutLogs (client_uid);
create index if not exists workoutLogs_trainer_idx on public.workoutLogs (trainer_uid);
create index if not exists workoutLogs_data_gin on public.workoutLogs using gin (data);
create trigger workoutLogs_touch before update on public.workoutLogs
  for each row execute function public.touch_updated_at();
alter table public.workoutLogs enable row level security;
create policy "workoutLogs_owner_select" on public.workoutLogs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "workoutLogs_owner_insert" on public.workoutLogs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "workoutLogs_owner_update" on public.workoutLogs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "workoutLogs_staff_delete" on public.workoutLogs for delete using (public.is_staff());

-- ---------- checkIns (client) ----------
create table if not exists public.checkIns (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists checkIns_client_idx on public.checkIns (client_uid);
create index if not exists checkIns_trainer_idx on public.checkIns (trainer_uid);
create index if not exists checkIns_data_gin on public.checkIns using gin (data);
create trigger checkIns_touch before update on public.checkIns
  for each row execute function public.touch_updated_at();
alter table public.checkIns enable row level security;
create policy "checkIns_owner_select" on public.checkIns for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "checkIns_owner_insert" on public.checkIns for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "checkIns_owner_update" on public.checkIns for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "checkIns_staff_delete" on public.checkIns for delete using (public.is_staff());

-- ---------- appointments (client) ----------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists appointments_client_idx on public.appointments (client_uid);
create index if not exists appointments_trainer_idx on public.appointments (trainer_uid);
create index if not exists appointments_data_gin on public.appointments using gin (data);
create trigger appointments_touch before update on public.appointments
  for each row execute function public.touch_updated_at();
alter table public.appointments enable row level security;
create policy "appointments_owner_select" on public.appointments for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "appointments_owner_insert" on public.appointments for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "appointments_owner_update" on public.appointments for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "appointments_staff_delete" on public.appointments for delete using (public.is_staff());

-- ---------- sleepLogs (client) ----------
create table if not exists public.sleepLogs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sleepLogs_client_idx on public.sleepLogs (client_uid);
create index if not exists sleepLogs_trainer_idx on public.sleepLogs (trainer_uid);
create index if not exists sleepLogs_data_gin on public.sleepLogs using gin (data);
create trigger sleepLogs_touch before update on public.sleepLogs
  for each row execute function public.touch_updated_at();
alter table public.sleepLogs enable row level security;
create policy "sleepLogs_owner_select" on public.sleepLogs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "sleepLogs_owner_insert" on public.sleepLogs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "sleepLogs_owner_update" on public.sleepLogs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "sleepLogs_staff_delete" on public.sleepLogs for delete using (public.is_staff());

-- ---------- mealLogs (client) ----------
create table if not exists public.mealLogs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mealLogs_client_idx on public.mealLogs (client_uid);
create index if not exists mealLogs_trainer_idx on public.mealLogs (trainer_uid);
create index if not exists mealLogs_data_gin on public.mealLogs using gin (data);
create trigger mealLogs_touch before update on public.mealLogs
  for each row execute function public.touch_updated_at();
alter table public.mealLogs enable row level security;
create policy "mealLogs_owner_select" on public.mealLogs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "mealLogs_owner_insert" on public.mealLogs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "mealLogs_owner_update" on public.mealLogs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "mealLogs_staff_delete" on public.mealLogs for delete using (public.is_staff());

-- ---------- progressPhotos (client) ----------
create table if not exists public.progressPhotos (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists progressPhotos_client_idx on public.progressPhotos (client_uid);
create index if not exists progressPhotos_trainer_idx on public.progressPhotos (trainer_uid);
create index if not exists progressPhotos_data_gin on public.progressPhotos using gin (data);
create trigger progressPhotos_touch before update on public.progressPhotos
  for each row execute function public.touch_updated_at();
alter table public.progressPhotos enable row level security;
create policy "progressPhotos_owner_select" on public.progressPhotos for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "progressPhotos_owner_insert" on public.progressPhotos for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "progressPhotos_owner_update" on public.progressPhotos for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "progressPhotos_staff_delete" on public.progressPhotos for delete using (public.is_staff());

-- ---------- user1RMs (client) ----------
create table if not exists public.user1RMs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists user1RMs_client_idx on public.user1RMs (client_uid);
create index if not exists user1RMs_trainer_idx on public.user1RMs (trainer_uid);
create index if not exists user1RMs_data_gin on public.user1RMs using gin (data);
create trigger user1RMs_touch before update on public.user1RMs
  for each row execute function public.touch_updated_at();
alter table public.user1RMs enable row level security;
create policy "user1RMs_owner_select" on public.user1RMs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "user1RMs_owner_insert" on public.user1RMs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "user1RMs_owner_update" on public.user1RMs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "user1RMs_staff_delete" on public.user1RMs for delete using (public.is_staff());

-- ---------- userCustomWeights (client) ----------
create table if not exists public.userCustomWeights (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists userCustomWeights_client_idx on public.userCustomWeights (client_uid);
create index if not exists userCustomWeights_trainer_idx on public.userCustomWeights (trainer_uid);
create index if not exists userCustomWeights_data_gin on public.userCustomWeights using gin (data);
create trigger userCustomWeights_touch before update on public.userCustomWeights
  for each row execute function public.touch_updated_at();
alter table public.userCustomWeights enable row level security;
create policy "userCustomWeights_owner_select" on public.userCustomWeights for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "userCustomWeights_owner_insert" on public.userCustomWeights for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "userCustomWeights_owner_update" on public.userCustomWeights for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "userCustomWeights_staff_delete" on public.userCustomWeights for delete using (public.is_staff());

-- ---------- favorites (client) ----------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists favorites_client_idx on public.favorites (client_uid);
create index if not exists favorites_trainer_idx on public.favorites (trainer_uid);
create index if not exists favorites_data_gin on public.favorites using gin (data);
create trigger favorites_touch before update on public.favorites
  for each row execute function public.touch_updated_at();
alter table public.favorites enable row level security;
create policy "favorites_owner_select" on public.favorites for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "favorites_owner_insert" on public.favorites for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "favorites_owner_update" on public.favorites for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "favorites_staff_delete" on public.favorites for delete using (public.is_staff());

-- ---------- clientSessionLogs (client) ----------
create table if not exists public.clientSessionLogs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clientSessionLogs_client_idx on public.clientSessionLogs (client_uid);
create index if not exists clientSessionLogs_trainer_idx on public.clientSessionLogs (trainer_uid);
create index if not exists clientSessionLogs_data_gin on public.clientSessionLogs using gin (data);
create trigger clientSessionLogs_touch before update on public.clientSessionLogs
  for each row execute function public.touch_updated_at();
alter table public.clientSessionLogs enable row level security;
create policy "clientSessionLogs_owner_select" on public.clientSessionLogs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientSessionLogs_owner_insert" on public.clientSessionLogs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "clientSessionLogs_owner_update" on public.clientSessionLogs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientSessionLogs_staff_delete" on public.clientSessionLogs for delete using (public.is_staff());

-- ---------- sessionLogs (client) ----------
create table if not exists public.sessionLogs (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sessionLogs_client_idx on public.sessionLogs (client_uid);
create index if not exists sessionLogs_trainer_idx on public.sessionLogs (trainer_uid);
create index if not exists sessionLogs_data_gin on public.sessionLogs using gin (data);
create trigger sessionLogs_touch before update on public.sessionLogs
  for each row execute function public.touch_updated_at();
alter table public.sessionLogs enable row level security;
create policy "sessionLogs_owner_select" on public.sessionLogs for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "sessionLogs_owner_insert" on public.sessionLogs for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "sessionLogs_owner_update" on public.sessionLogs for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "sessionLogs_staff_delete" on public.sessionLogs for delete using (public.is_staff());

-- ---------- clientAssessments (client) ----------
create table if not exists public.clientAssessments (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clientAssessments_client_idx on public.clientAssessments (client_uid);
create index if not exists clientAssessments_trainer_idx on public.clientAssessments (trainer_uid);
create index if not exists clientAssessments_data_gin on public.clientAssessments using gin (data);
create trigger clientAssessments_touch before update on public.clientAssessments
  for each row execute function public.touch_updated_at();
alter table public.clientAssessments enable row level security;
create policy "clientAssessments_owner_select" on public.clientAssessments for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientAssessments_owner_insert" on public.clientAssessments for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "clientAssessments_owner_update" on public.clientAssessments for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientAssessments_staff_delete" on public.clientAssessments for delete using (public.is_staff());

-- ---------- packagePurchases (client) ----------
create table if not exists public.packagePurchases (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists packagePurchases_client_idx on public.packagePurchases (client_uid);
create index if not exists packagePurchases_trainer_idx on public.packagePurchases (trainer_uid);
create index if not exists packagePurchases_data_gin on public.packagePurchases using gin (data);
create trigger packagePurchases_touch before update on public.packagePurchases
  for each row execute function public.touch_updated_at();
alter table public.packagePurchases enable row level security;
create policy "packagePurchases_owner_select" on public.packagePurchases for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packagePurchases_owner_insert" on public.packagePurchases for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "packagePurchases_owner_update" on public.packagePurchases for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packagePurchases_staff_delete" on public.packagePurchases for delete using (public.is_staff());

-- ---------- packageReminders (client) ----------
create table if not exists public.packageReminders (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists packageReminders_client_idx on public.packageReminders (client_uid);
create index if not exists packageReminders_trainer_idx on public.packageReminders (trainer_uid);
create index if not exists packageReminders_data_gin on public.packageReminders using gin (data);
create trigger packageReminders_touch before update on public.packageReminders
  for each row execute function public.touch_updated_at();
alter table public.packageReminders enable row level security;
create policy "packageReminders_owner_select" on public.packageReminders for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packageReminders_owner_insert" on public.packageReminders for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "packageReminders_owner_update" on public.packageReminders for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "packageReminders_staff_delete" on public.packageReminders for delete using (public.is_staff());

-- ---------- invoices (client) ----------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists invoices_client_idx on public.invoices (client_uid);
create index if not exists invoices_trainer_idx on public.invoices (trainer_uid);
create index if not exists invoices_data_gin on public.invoices using gin (data);
create trigger invoices_touch before update on public.invoices
  for each row execute function public.touch_updated_at();
alter table public.invoices enable row level security;
create policy "invoices_owner_select" on public.invoices for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "invoices_owner_insert" on public.invoices for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "invoices_owner_update" on public.invoices for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "invoices_staff_delete" on public.invoices for delete using (public.is_staff());

-- ---------- notifications (client) ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notifications_client_idx on public.notifications (client_uid);
create index if not exists notifications_trainer_idx on public.notifications (trainer_uid);
create index if not exists notifications_data_gin on public.notifications using gin (data);
create trigger notifications_touch before update on public.notifications
  for each row execute function public.touch_updated_at();
alter table public.notifications enable row level security;
create policy "notifications_owner_select" on public.notifications for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "notifications_owner_insert" on public.notifications for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "notifications_owner_update" on public.notifications for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "notifications_staff_delete" on public.notifications for delete using (public.is_staff());

-- ---------- mealPlans (client) ----------
create table if not exists public.mealPlans (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mealPlans_client_idx on public.mealPlans (client_uid);
create index if not exists mealPlans_trainer_idx on public.mealPlans (trainer_uid);
create index if not exists mealPlans_data_gin on public.mealPlans using gin (data);
create trigger mealPlans_touch before update on public.mealPlans
  for each row execute function public.touch_updated_at();
alter table public.mealPlans enable row level security;
create policy "mealPlans_owner_select" on public.mealPlans for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "mealPlans_owner_insert" on public.mealPlans for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "mealPlans_owner_update" on public.mealPlans for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "mealPlans_staff_delete" on public.mealPlans for delete using (public.is_staff());

-- ---------- customPrograms (client) ----------
create table if not exists public.customPrograms (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customPrograms_client_idx on public.customPrograms (client_uid);
create index if not exists customPrograms_trainer_idx on public.customPrograms (trainer_uid);
create index if not exists customPrograms_data_gin on public.customPrograms using gin (data);
create trigger customPrograms_touch before update on public.customPrograms
  for each row execute function public.touch_updated_at();
alter table public.customPrograms enable row level security;
create policy "customPrograms_owner_select" on public.customPrograms for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "customPrograms_owner_insert" on public.customPrograms for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "customPrograms_owner_update" on public.customPrograms for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "customPrograms_staff_delete" on public.customPrograms for delete using (public.is_staff());

-- ---------- clientPrograms (client) ----------
create table if not exists public.clientPrograms (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clientPrograms_client_idx on public.clientPrograms (client_uid);
create index if not exists clientPrograms_trainer_idx on public.clientPrograms (trainer_uid);
create index if not exists clientPrograms_data_gin on public.clientPrograms using gin (data);
create trigger clientPrograms_touch before update on public.clientPrograms
  for each row execute function public.touch_updated_at();
alter table public.clientPrograms enable row level security;
create policy "clientPrograms_owner_select" on public.clientPrograms for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientPrograms_owner_insert" on public.clientPrograms for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "clientPrograms_owner_update" on public.clientPrograms for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "clientPrograms_staff_delete" on public.clientPrograms for delete using (public.is_staff());

-- ---------- coachingApplications (client) ----------
create table if not exists public.coachingApplications (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists coachingApplications_client_idx on public.coachingApplications (client_uid);
create index if not exists coachingApplications_trainer_idx on public.coachingApplications (trainer_uid);
create index if not exists coachingApplications_data_gin on public.coachingApplications using gin (data);
create trigger coachingApplications_touch before update on public.coachingApplications
  for each row execute function public.touch_updated_at();
alter table public.coachingApplications enable row level security;
create policy "coachingApplications_owner_select" on public.coachingApplications for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "coachingApplications_owner_insert" on public.coachingApplications for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "coachingApplications_owner_update" on public.coachingApplications for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "coachingApplications_staff_delete" on public.coachingApplications for delete using (public.is_staff());

-- ---------- chats (client) ----------
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chats_client_idx on public.chats (client_uid);
create index if not exists chats_trainer_idx on public.chats (trainer_uid);
create index if not exists chats_data_gin on public.chats using gin (data);
create trigger chats_touch before update on public.chats
  for each row execute function public.touch_updated_at();
alter table public.chats enable row level security;
create policy "chats_owner_select" on public.chats for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "chats_owner_insert" on public.chats for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "chats_owner_update" on public.chats for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "chats_staff_delete" on public.chats for delete using (public.is_staff());

-- ---------- messages (client) ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists messages_client_idx on public.messages (client_uid);
create index if not exists messages_trainer_idx on public.messages (trainer_uid);
create index if not exists messages_data_gin on public.messages using gin (data);
create trigger messages_touch before update on public.messages
  for each row execute function public.touch_updated_at();
alter table public.messages enable row level security;
create policy "messages_owner_select" on public.messages for select
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "messages_owner_insert" on public.messages for insert
  with check (client_uid = public.fb_uid() or public.is_staff());
create policy "messages_owner_update" on public.messages for update
  using (client_uid = public.fb_uid() or trainer_uid = public.fb_uid() or public.is_staff());
create policy "messages_staff_delete" on public.messages for delete using (public.is_staff());

-- ---------- communityPosts (community) ----------
create table if not exists public.communityPosts (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists communityPosts_client_idx on public.communityPosts (client_uid);
create index if not exists communityPosts_trainer_idx on public.communityPosts (trainer_uid);
create index if not exists communityPosts_data_gin on public.communityPosts using gin (data);
create trigger communityPosts_touch before update on public.communityPosts
  for each row execute function public.touch_updated_at();
alter table public.communityPosts enable row level security;
create policy "communityPosts_authed_select" on public.communityPosts for select using (auth.uid() is not null);
create policy "communityPosts_authed_insert" on public.communityPosts for insert
  with check (client_uid = public.fb_uid());
create policy "communityPosts_author_update" on public.communityPosts for update
  using (client_uid = public.fb_uid() or public.is_staff());
create policy "communityPosts_author_delete" on public.communityPosts for delete
  using (client_uid = public.fb_uid() or public.is_staff());

-- ---------- replies (community) ----------
create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists replies_client_idx on public.replies (client_uid);
create index if not exists replies_trainer_idx on public.replies (trainer_uid);
create index if not exists replies_data_gin on public.replies using gin (data);
create trigger replies_touch before update on public.replies
  for each row execute function public.touch_updated_at();
alter table public.replies enable row level security;
create policy "replies_authed_select" on public.replies for select using (auth.uid() is not null);
create policy "replies_authed_insert" on public.replies for insert
  with check (client_uid = public.fb_uid());
create policy "replies_author_update" on public.replies for update
  using (client_uid = public.fb_uid() or public.is_staff());
create policy "replies_author_delete" on public.replies for delete
  using (client_uid = public.fb_uid() or public.is_staff());

-- ---------- workoutPrograms (public) ----------
create table if not exists public.workoutPrograms (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workoutPrograms_client_idx on public.workoutPrograms (client_uid);
create index if not exists workoutPrograms_trainer_idx on public.workoutPrograms (trainer_uid);
create index if not exists workoutPrograms_data_gin on public.workoutPrograms using gin (data);
create trigger workoutPrograms_touch before update on public.workoutPrograms
  for each row execute function public.touch_updated_at();
alter table public.workoutPrograms enable row level security;
create policy "workoutPrograms_public_select" on public.workoutPrograms for select using (true);
create policy "workoutPrograms_staff_write" on public.workoutPrograms for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- workoutTemplates (public) ----------
create table if not exists public.workoutTemplates (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workoutTemplates_client_idx on public.workoutTemplates (client_uid);
create index if not exists workoutTemplates_trainer_idx on public.workoutTemplates (trainer_uid);
create index if not exists workoutTemplates_data_gin on public.workoutTemplates using gin (data);
create trigger workoutTemplates_touch before update on public.workoutTemplates
  for each row execute function public.touch_updated_at();
alter table public.workoutTemplates enable row level security;
create policy "workoutTemplates_public_select" on public.workoutTemplates for select using (true);
create policy "workoutTemplates_staff_write" on public.workoutTemplates for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- workoutPackages (public) ----------
create table if not exists public.workoutPackages (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workoutPackages_client_idx on public.workoutPackages (client_uid);
create index if not exists workoutPackages_trainer_idx on public.workoutPackages (trainer_uid);
create index if not exists workoutPackages_data_gin on public.workoutPackages using gin (data);
create trigger workoutPackages_touch before update on public.workoutPackages
  for each row execute function public.touch_updated_at();
alter table public.workoutPackages enable row level security;
create policy "workoutPackages_public_select" on public.workoutPackages for select using (true);
create policy "workoutPackages_staff_write" on public.workoutPackages for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- workouts (public) ----------
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workouts_client_idx on public.workouts (client_uid);
create index if not exists workouts_trainer_idx on public.workouts (trainer_uid);
create index if not exists workouts_data_gin on public.workouts using gin (data);
create trigger workouts_touch before update on public.workouts
  for each row execute function public.touch_updated_at();
alter table public.workouts enable row level security;
create policy "workouts_public_select" on public.workouts for select using (true);
create policy "workouts_staff_write" on public.workouts for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- exerciseLibrary (public) ----------
create table if not exists public.exerciseLibrary (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists exerciseLibrary_client_idx on public.exerciseLibrary (client_uid);
create index if not exists exerciseLibrary_trainer_idx on public.exerciseLibrary (trainer_uid);
create index if not exists exerciseLibrary_data_gin on public.exerciseLibrary using gin (data);
create trigger exerciseLibrary_touch before update on public.exerciseLibrary
  for each row execute function public.touch_updated_at();
alter table public.exerciseLibrary enable row level security;
create policy "exerciseLibrary_public_select" on public.exerciseLibrary for select using (true);
create policy "exerciseLibrary_staff_write" on public.exerciseLibrary for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- testimonials (public) ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists testimonials_client_idx on public.testimonials (client_uid);
create index if not exists testimonials_trainer_idx on public.testimonials (trainer_uid);
create index if not exists testimonials_data_gin on public.testimonials using gin (data);
create trigger testimonials_touch before update on public.testimonials
  for each row execute function public.touch_updated_at();
alter table public.testimonials enable row level security;
create policy "testimonials_public_select" on public.testimonials for select using (true);
create policy "testimonials_staff_write" on public.testimonials for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- gallery (public) ----------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gallery_client_idx on public.gallery (client_uid);
create index if not exists gallery_trainer_idx on public.gallery (trainer_uid);
create index if not exists gallery_data_gin on public.gallery using gin (data);
create trigger gallery_touch before update on public.gallery
  for each row execute function public.touch_updated_at();
alter table public.gallery enable row level security;
create policy "gallery_public_select" on public.gallery for select using (true);
create policy "gallery_staff_write" on public.gallery for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- siteSettings (public) ----------
create table if not exists public.siteSettings (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists siteSettings_client_idx on public.siteSettings (client_uid);
create index if not exists siteSettings_trainer_idx on public.siteSettings (trainer_uid);
create index if not exists siteSettings_data_gin on public.siteSettings using gin (data);
create trigger siteSettings_touch before update on public.siteSettings
  for each row execute function public.touch_updated_at();
alter table public.siteSettings enable row level security;
create policy "siteSettings_public_select" on public.siteSettings for select using (true);
create policy "siteSettings_staff_write" on public.siteSettings for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- meals (public) ----------
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists meals_client_idx on public.meals (client_uid);
create index if not exists meals_trainer_idx on public.meals (trainer_uid);
create index if not exists meals_data_gin on public.meals using gin (data);
create trigger meals_touch before update on public.meals
  for each row execute function public.touch_updated_at();
alter table public.meals enable row level security;
create policy "meals_public_select" on public.meals for select using (true);
create policy "meals_staff_write" on public.meals for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- publicCoachingApplications (publicwrite) ----------
create table if not exists public.publicCoachingApplications (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists publicCoachingApplications_client_idx on public.publicCoachingApplications (client_uid);
create index if not exists publicCoachingApplications_trainer_idx on public.publicCoachingApplications (trainer_uid);
create index if not exists publicCoachingApplications_data_gin on public.publicCoachingApplications using gin (data);
create trigger publicCoachingApplications_touch before update on public.publicCoachingApplications
  for each row execute function public.touch_updated_at();
alter table public.publicCoachingApplications enable row level security;
create policy "publicCoachingApplications_anyone_insert" on public.publicCoachingApplications for insert with check (true);
create policy "publicCoachingApplications_staff_read" on public.publicCoachingApplications for select using (public.is_staff());
create policy "publicCoachingApplications_staff_manage" on public.publicCoachingApplications for update using (public.is_staff());
create policy "publicCoachingApplications_staff_delete" on public.publicCoachingApplications for delete using (public.is_staff());

-- ---------- packageAuditLog (staff) ----------
create table if not exists public.packageAuditLog (
  id uuid primary key default gen_random_uuid(),
  firestore_id text unique,
  client_uid text,
  trainer_uid text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists packageAuditLog_client_idx on public.packageAuditLog (client_uid);
create index if not exists packageAuditLog_trainer_idx on public.packageAuditLog (trainer_uid);
create index if not exists packageAuditLog_data_gin on public.packageAuditLog using gin (data);
create trigger packageAuditLog_touch before update on public.packageAuditLog
  for each row execute function public.touch_updated_at();
alter table public.packageAuditLog enable row level security;
create policy "packageAuditLog_staff_all" on public.packageAuditLog for all
  using (public.is_staff()) with check (public.is_staff());

-- End of schema. Run link_profiles() after Supabase Auth import: select public.link_profiles();

-- ---------- RLS: profiles (applied in production migration 1) ----------
alter table public.profiles enable row level security;
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or role = 'trainer' or public.is_staff());
create policy "profiles_self_insert" on public.profiles for insert
  with check (id = auth.uid());
create policy "profiles_self_update" on public.profiles for update
  using (id = auth.uid() or public.is_staff());
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Staging is service-role only: RLS on, no policies.
alter table public.profiles_staging enable row level security;
