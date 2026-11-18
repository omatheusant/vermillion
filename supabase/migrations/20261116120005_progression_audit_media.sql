-- Progressão, revisão, auditoria e mídia — docs/DATA_MODEL.md §3–4.

create table xp_ledger (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  delta integer not null,
  reason text not null,
  category text not null,
  approved_by uuid references profiles(id),
  applied_at timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
create index idx_xp_ledger_character on xp_ledger(character_id, created_at desc);

create type character_revision_reason as enum ('creation_approved','xp_applied','narrator_edit');

create table character_revisions (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  snapshot jsonb not null,
  reason character_revision_reason not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
create index idx_character_revisions_character on character_revisions(character_id, created_at desc);

create type review_event_action as enum ('submitted','approved','changes_requested','published');

create table review_events (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  reviewer_id uuid not null references profiles(id),
  action review_event_action not null,
  comment text,
  created_at timestamptz not null default now()
);
create index idx_review_events_character on review_events(character_id, created_at desc);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references profiles(id),
  character_id uuid references characters(id) on delete set null,
  chronicle_id uuid references chronicles(id) on delete set null,
  action text not null,
  justification text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_events_character on audit_events(character_id, created_at desc);
create index idx_audit_events_chronicle on audit_events(chronicle_id, created_at desc);

create type media_kind as enum ('portrait','avatar','other');

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  kind media_kind not null,
  created_at timestamptz not null default now()
);
create index idx_media_assets_owner on media_assets(owner_id);
create index idx_media_assets_character on media_assets(character_id);

alter table profiles
  add constraint fk_profiles_avatar_media foreign key (avatar_media_id) references media_assets(id) on delete set null;

-- Presença efêmera multi-aba (ADR 0003) — sem retenção/auditoria, TTL
-- aplicado em app (heartbeat ~15s, sessão considerada "ativa" por
-- last_seen_at recente).
create table character_edit_sessions (
  character_id uuid not null references characters(id) on delete cascade,
  step smallint not null,
  session_id text not null,
  client_label text,
  last_seen_at timestamptz not null default now(),
  primary key (character_id, step, session_id)
);
create index idx_character_edit_sessions_seen on character_edit_sessions(character_id, step, last_seen_at desc);
