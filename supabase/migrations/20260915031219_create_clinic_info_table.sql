create table public.clinic_info (
  id boolean primary key default true check (id),
  name text not null,
  address text not null,
  phone text,
  maps_url text,
  created_at timestamptz not null default now()
);

alter table public.clinic_info enable row level security;

create policy "public read clinic info"
  on public.clinic_info for select
  to anon, authenticated
  using (true);
