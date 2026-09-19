create extension if not exists btree_gist with schema extensions;

-- doctors

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  bio text,
  photo_url text,
  gcal_calendar_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.doctors enable row level security;

create policy "public read active doctors"
  on public.doctors for select
  to anon, authenticated
  using (is_active = true);

-- gcal_calendar_id is only for n8n (service_role), keep it out of the public API
revoke select on public.doctors from anon, authenticated;
grant select (id, name, specialty, bio, photo_url, is_active, created_at)
  on public.doctors to anon, authenticated;

-- which services each doctor offers

create table public.doctor_services (
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (doctor_id, service_id)
);

create index doctor_services_service_idx on public.doctor_services (service_id);

alter table public.doctor_services enable row level security;

create policy "public read doctor services"
  on public.doctor_services for select
  to anon, authenticated
  using (true);

-- weekly practice hours per doctor (replaces service_availability)

create table public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  constraint doctor_availability_time_order check (start_time < end_time)
);

create index doctor_availability_doctor_idx
  on public.doctor_availability (doctor_id, day_of_week);

alter table public.doctor_availability enable row level security;

create policy "public read doctor availability"
  on public.doctor_availability for select
  to anon, authenticated
  using (true);

drop table public.service_availability;

-- bookings now belong to a doctor

do $$
begin
  if exists (select 1 from public.bookings) then
    raise exception 'public.bookings is not empty: existing bookings have no doctor, delete them before running this migration';
  end if;
end $$;

drop index public.bookings_slot_unique;

alter table public.bookings
  add column doctor_id uuid not null,
  add column ends_at timestamptz not null,
  add constraint bookings_time_order check (starts_at < ends_at),
  add constraint bookings_doctor_service_fkey
    foreign key (doctor_id, service_id)
    references public.doctor_services (doctor_id, service_id)
    on delete restrict,
  -- a doctor can't have overlapping appointments, even across services with different durations
  add constraint bookings_no_overlap
    exclude using gist (
      doctor_id with =,
      tstzrange(starts_at, ends_at) with &&
    ) where (status <> 'cancelled');

create index bookings_doctor_starts_at_idx on public.bookings (doctor_id, starts_at);
