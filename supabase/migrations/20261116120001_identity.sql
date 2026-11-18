-- Identidade e crônica — docs/DATA_MODEL.md §1
-- Perfis, crônica única do Discord e papéis de narrador/admin.
-- chronicle_role é a ÚNICA fonte de verdade para autorização de staff
-- (nunca auth.users.user_metadata, ver docs/DATA_MODEL.md §5.1).

create extension if not exists pgcrypto;

create type chronicle_role as enum ('player', 'storyteller', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_media_id uuid,
  bio text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table chronicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table chronicle_memberships (
  id uuid primary key default gen_random_uuid(),
  chronicle_id uuid not null references chronicles(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role chronicle_role not null,
  invited_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (chronicle_id, user_id)
);

create index idx_chronicle_memberships_user on chronicle_memberships(user_id);
create index idx_chronicle_memberships_chronicle on chronicle_memberships(chronicle_id);

-- Helper SECURITY DEFINER reaproveitado por toda policy que precisa saber
-- se auth.uid() é staff de uma crônica — evita duplicar a subquery (e
-- risco de recursão de RLS) em cada tabela (docs/DATA_MODEL.md §5.2).
create or replace function is_chronicle_staff(p_chronicle_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from chronicle_memberships
    where chronicle_id = p_chronicle_id
      and user_id = auth.uid()
      and role in ('storyteller', 'admin')
  );
$$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_chronicles_updated_at before update on chronicles
  for each row execute function set_updated_at();

-- Crônica única vinculada ao servidor de Discord (produto não é
-- multi-tenant). Settings nunca inclui "max_active_characters" — o teto
-- de 3 é fixo via schema, não configurável (ADR 0002).
insert into chronicles (name, slug, settings)
values (
  'Vermillion',
  'vermillion',
  jsonb_build_object(
    'clans_enabled', null,
    'sects_enabled', jsonb_build_array('camarilla', 'anarch', 'sabbat', 'ashirra', 'independent'),
    'starting_budget', jsonb_build_object('merits', 7, 'flaws', 2, 'humanity', 7)
  )
);

-- Todo novo usuário autenticado ganha um profile e entra como 'player'
-- na crônica única — não há fluxo de convite no MVP (produto
-- single-tenant atrelado a um servidor de Discord).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, pg_temp
as $$
declare
  v_chronicle_id uuid;
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'vampiro-' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'display_name'
  );

  select id into v_chronicle_id from public.chronicles where slug = 'vermillion' limit 1;
  if v_chronicle_id is not null then
    insert into public.chronicle_memberships (chronicle_id, user_id, role)
    values (v_chronicle_id, new.id, 'player')
    on conflict (chronicle_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();
