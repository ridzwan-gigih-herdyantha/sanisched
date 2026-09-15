create table public.service_availability (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  constraint availability_time_order check (start_time < end_time)
);

create index availability_service_idx
  on public.service_availability (service_id, day_of_week);

alter table public.service_availability enable row level security;

create policy "public read availability"
  on public.service_availability for select
  to anon, authenticated
  using (true);
