create table if not exists public.invoice_sync_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reason text not null,
  snapshot_timestamp bigint not null,
  saved_invoices jsonb not null,
  customer_templates jsonb not null,
  payload_bytes integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists invoice_sync_snapshots_updated_at_idx
  on public.invoice_sync_snapshots (updated_at desc);

alter table public.invoice_sync_snapshots enable row level security;

drop policy if exists "users can select own sync snapshot"
  on public.invoice_sync_snapshots;

drop policy if exists "users can insert own sync snapshot"
  on public.invoice_sync_snapshots;

drop policy if exists "users can update own sync snapshot"
  on public.invoice_sync_snapshots;

create policy "users can select own sync snapshot"
  on public.invoice_sync_snapshots
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own sync snapshot"
  on public.invoice_sync_snapshots
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own sync snapshot"
  on public.invoice_sync_snapshots
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_invoice_sync_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_invoice_sync_snapshots_updated_at on public.invoice_sync_snapshots;

create trigger trg_invoice_sync_snapshots_updated_at
before update on public.invoice_sync_snapshots
for each row
execute function public.set_invoice_sync_snapshots_updated_at();
