-- Núcleo de personagem — docs/DATA_MODEL.md §2, ADR 0002 (3 slots + advisory lock).

create type character_status as enum ('draft','submitted','changes_requested','approved','published','archived');
create type character_lineage as enum ('clan','caitiff','thin_blood');
create type character_visibility as enum ('private','unlisted','public');

create table characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  chronicle_id uuid not null references chronicles(id) on delete cascade,
  slug text,
  public_share_token text unique,
  name text not null,
  clan_id text references reference_clans(id),
  lineage character_lineage not null default 'clan',
  status character_status not null default 'draft',
  visibility character_visibility not null default 'private',
  -- null quando archived (ADR 0002); 1..3 enquanto ativo.
  slot_number smallint check (slot_number between 1 and 3),
  creation_step smallint not null default 0,
  version integer not null default 1,
  ruleset_version text not null default 'v5-vermillion-2026.1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_clan_lineage_consistency check (
    (lineage = 'clan') or (clan_id is null)
  )
);

-- Teto de 3 personagens ativos por usuário+crônica — índice parcial real
-- (ADR 0002), não a constraint UNIQUE ingênua documentada em prosa.
create unique index uq_active_slot on characters (owner_id, chronicle_id, slot_number)
  where status <> 'archived';

create index idx_characters_owner on characters(owner_id);
create index idx_characters_chronicle_status on characters(chronicle_id, status);
create index idx_characters_gallery on characters(visibility, status, created_at desc);
create unique index uq_characters_slug_per_chronicle on characters(chronicle_id, slug) where slug is not null;

create trigger trg_characters_updated_at before update on characters
  for each row execute function set_updated_at();

-- Defesa em profundidade (ADR 0007): transições de status e edição de
-- personagens travados (submitted/approved/published) só valem quando a
-- própria transação é uma função RPC SECURITY DEFINER, sinalizada via GUC
-- local 'vermillion.via_rpc'. Nenhuma policy de UPDATE solta no client
-- consegue forjar aprovação/publicação (critério de aceite #10).
create or replace function enforce_character_lock()
returns trigger
language plpgsql
as $$
begin
  if old.status in ('submitted','approved','published')
     and coalesce(current_setting('vermillion.via_rpc', true), 'off') <> 'on' then
    raise exception 'Personagem bloqueado para edição direta no status "%". Use o fluxo apropriado.', old.status
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_character_lock
  before update on characters
  for each row execute function enforce_character_lock();

create or replace function enforce_status_transition_guard()
returns trigger
language plpgsql
as $$
begin
  if new.status <> old.status
     and coalesce(current_setting('vermillion.via_rpc', true), 'off') <> 'on' then
    raise exception 'Transições de status exigem o fluxo apropriado (RPC).' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger trg_status_transition_guard
  before update of status on characters
  for each row execute function enforce_status_transition_guard();

-- Atribuição atômica de slot (ADR 0002): lock de transação por
-- (owner_id, chronicle_id) antes de procurar o primeiro slot livre
-- entre 1..3; sem slot livre, levanta P0001. Arquivar sempre libera o
-- slot (seta null), sem precisar do lock.
create or replace function assign_character_slot()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slot smallint;
begin
  if new.status = 'archived' then
    new.slot_number := null;
    return new;
  end if;

  if tg_op = 'UPDATE' and old.slot_number is not null and old.status <> 'archived' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text || ':' || new.chronicle_id::text, 0));

  select s.slot into v_slot
  from unnest(array[1,2,3]) as s(slot)
  where not exists (
    select 1 from characters c
    where c.owner_id = new.owner_id
      and c.chronicle_id = new.chronicle_id
      and c.status <> 'archived'
      and c.slot_number = s.slot
      and c.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  order by s.slot
  limit 1;

  if v_slot is null then
    raise exception 'Limite de 3 personagens ativos atingido para esta crônica.' using errcode = 'P0001';
  end if;

  new.slot_number := v_slot;
  return new;
end;
$$;

create trigger trg_assign_character_slot
  before insert or update of status on characters
  for each row execute function assign_character_slot();

create table character_details (
  character_id uuid primary key references characters(id) on delete cascade,
  -- públicos (podem aparecer na galeria se visibility='public' e status='published')
  social_name text,
  apparent_age smallint,
  nationality text,
  occupation text,
  concept text,
  ambition text,
  desire text,
  appearance text,
  personality text,
  -- privados — nunca em payload público, OpenGraph, busca ou view pública.
  real_age smallint,
  real_name text,
  embrace_date date,
  sire_name text,
  human_history text,
  embrace_account text,
  after_embrace text,
  haven_notes text,
  relationships text,
  possessions text,
  private_notes text,
  updated_at timestamptz not null default now()
);

create trigger trg_character_details_updated_at before update on character_details
  for each row execute function set_updated_at();
