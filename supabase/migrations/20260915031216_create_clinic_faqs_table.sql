create table public.clinic_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  created_at timestamptz not null default now()
);

alter table public.clinic_faqs enable row level security;

create policy "public read faqs"
  on public.clinic_faqs for select
  to anon, authenticated
  using (true);
