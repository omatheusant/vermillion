-- Tabelas filhas de personagem — docs/DATA_MODEL.md §2.
-- Saúde e Força de Vontade guardam dano superficial/agravado separados
-- (character_tracks), nunca um contador único.

create table character_attributes (
  character_id uuid not null references characters(id) on delete cascade,
  attribute_id text not null,
  value smallint not null check (value between 1 and 5),
  primary key (character_id, attribute_id)
);

create table character_skills (
  character_id uuid not null references characters(id) on delete cascade,
  skill_id text not null,
  value smallint not null check (value between 0 and 5),
  primary key (character_id, skill_id)
);

create table character_specializations (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  skill_id text not null,
  label text not null,
  is_free boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_character_specializations_character on character_specializations(character_id);

create type character_discipline_source as enum ('clan','out_of_clan','caitiff');

create table character_disciplines (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  discipline_id text not null references reference_disciplines(id),
  value smallint not null check (value between 0 and 5),
  source character_discipline_source not null default 'clan',
  created_at timestamptz not null default now(),
  unique (character_id, discipline_id)
);

create table character_powers (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  discipline_id text not null references reference_disciplines(id),
  -- power_ref_id preenchido quando vem do catálogo verified_from_source;
  -- custom_* só quando granted_by_narrator_id não é nulo (ADR 0008).
  power_ref_id uuid references reference_powers(id),
  custom_name text,
  custom_level smallint,
  custom_summary text,
  granted_by_narrator_id uuid references profiles(id),
  source_reference text,
  created_at timestamptz not null default now(),
  constraint chk_power_custom_requires_narrator check (
    (custom_name is null and custom_level is null and custom_summary is null)
    or granted_by_narrator_id is not null
  )
);
create index idx_character_powers_character on character_powers(character_id);

create type character_advantage_source as enum ('base_budget','predator_type','xp');

create table character_advantages (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  kind text not null check (kind in ('merit','background')),
  ref_id uuid references reference_advantages(id),
  custom_label text,
  dots smallint not null check (dots between 1 and 5),
  source character_advantage_source not null default 'base_budget',
  created_at timestamptz not null default now()
);
create index idx_character_advantages_character on character_advantages(character_id);

create table character_flaws (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  ref_id uuid references reference_advantages(id),
  custom_label text,
  dots smallint not null check (dots between 1 and 5),
  source character_advantage_source not null default 'base_budget',
  created_at timestamptz not null default now()
);
create index idx_character_flaws_character on character_flaws(character_id);

create table character_convictions (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  label text not null,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);
create index idx_character_convictions_character on character_convictions(character_id);

create table character_touchstones (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  conviction_id uuid references character_convictions(id) on delete cascade,
  name text not null,
  bond text,
  meaning text,
  status text,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_character_touchstones_character on character_touchstones(character_id);

create table character_tracks (
  character_id uuid primary key references characters(id) on delete cascade,
  health_max smallint not null default 0,
  health_superficial smallint not null default 0,
  health_aggravated smallint not null default 0,
  willpower_max smallint not null default 0,
  willpower_superficial smallint not null default 0,
  willpower_aggravated smallint not null default 0,
  humanity smallint not null default 7,
  hunger smallint not null default 1 check (hunger between 0 and 5),
  blood_potency smallint not null default 1,
  updated_at timestamptz not null default now()
);

create trigger trg_character_tracks_updated_at before update on character_tracks
  for each row execute function set_updated_at();
