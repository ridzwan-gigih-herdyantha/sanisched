create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  starts_at timestamptz not null,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  reminder_sent_at timestamptz,
  gcal_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index bookings_slot_unique
  on public.bookings (service_id, starts_at)
  where status <> 'cancelled';

create index bookings_starts_at_idx on public.bookings (starts_at);

create index bookings_gcal_pending_idx
  on public.bookings (created_at)
  where gcal_event_id is null and status = 'confirmed';

create index bookings_reminder_pending_idx
  on public.bookings (starts_at)
  where reminder_sent_at is null and status = 'confirmed';

create index bookings_updated_at_idx on public.bookings (updated_at);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;
