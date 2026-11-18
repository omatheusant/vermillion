# Modelo de Dados — Vermillion

Schema em PostgreSQL (Supabase), migrations SQL versionadas em `supabase/migrations/`. Tipos TypeScript gerados (não escritos à mão) via `supabase gen types typescript` — ver ADR 0010.

Convenções: `snake_case` para tabelas/colunas, `id uuid default gen_random_uuid()` como PK padrão, `created_at`/`updated_at timestamptz default now()` em toda tabela mutável, enums Postgres para campos de estado fechado.

## 1. Identidade e crônica

```
profiles
  id uuid PK references auth.users(id) on delete cascade
  username text unique not null          -- slug, usado em /u/[username]
  display_name text
  avatar_media_id uuid references media_assets(id)
  bio text
  preferences jsonb not null default '{}'
  created_at, updated_at

chronicles
  id uuid PK
  name text not null
  slug text unique not null
  settings jsonb not null default '{}'    -- clãs/seitas habilitados, preset de predador, ponto inicial — NUNCA "max_active_characters" (ADR 0002)
  created_at, updated_at

chronicle_memberships
  id uuid PK
  chronicle_id uuid references chronicles(id) on delete cascade
  user_id uuid references profiles(id) on delete cascade
  role chronicle_role not null            -- enum: 'player' | 'storyteller' | 'admin'
  invited_by uuid references profiles(id)
  created_at
  unique (chronicle_id, user_id)
```

`chronicle_role` é a **única** fonte de verdade para autorização de narrador/admin. Nunca ler `role` de `auth.users.user_metadata` (editável pelo próprio usuário) — ver seção 5.

## 2. Personagem — núcleo

```
character_status: enum 'draft' | 'submitted' | 'changes_requested' | 'approved' | 'published' | 'archived'

characters
  id uuid PK
  owner_id uuid references profiles(id) on delete cascade
  chronicle_id uuid references chronicles(id) on delete cascade
  slug text                               -- único no contexto da crônica, gerado ao publicar
  public_share_token text unique          -- identificador longo/imprevisível para link não listado (ver LEGAL/UX)
  name text not null
  clan_id text references reference_clans(id)   -- nullable: Caitiff/Sangue-Ralo tratam separado (coluna lineage)
  lineage character_lineage not null default 'clan'  -- enum: 'clan' | 'caitiff' | 'thin_blood'
  status character_status not null default 'draft'
  visibility character_visibility not null default 'private'  -- enum: 'private' | 'unlisted' | 'public'
  slot_number smallint check (slot_number between 1 and 3),  -- null quando archived (ADR 0002)
  creation_step smallint not null default 0
  version integer not null default 1       -- optimistic concurrency (ADR 0003)
  ruleset_version text not null
  created_at, updated_at

  constraint uq_active_slot unique (owner_id, chronicle_id, slot_number)
    -- válido apenas enquanto status <> 'archived'; reforçado via índice parcial, não aqui
```

Índice parcial real (migration): `create unique index uq_active_slot on characters (owner_id, chronicle_id, slot_number) where status <> 'archived';`

```
character_details
  character_id uuid PK references characters(id) on delete cascade
  -- públicos (podem aparecer na galeria se visibility='public')
  social_name text, apparent_age int, nationality text, occupation text,
  concept text, ambition text, desire text, appearance text, personality text,
  -- privados (nunca em payload público)
  real_age int, real_name text, embrace_date date, sire_name text,
  human_history text, embrace_account text, after_embrace text, haven_notes text,
  relationships text, possessions text, private_notes text,
  updated_at
```

Separação pública/privada é por **coluna**, não por flag em JSON — permite que a view/policy pública faça `select` explícito das colunas permitidas sem risco de esquecer um campo dentro de um blob.

```
character_attributes (character_id, attribute_id, value smallint check 1..5)  -- PK composta
character_skills (character_id, skill_id, value smallint check 0..5)
character_specializations (id, character_id, skill_id, label text, is_free boolean)
character_disciplines (id, character_id, discipline_id, value smallint, source 'clan'|'out_of_clan'|'caitiff')
character_powers (id, character_id, discipline_id, power_ref_id references reference_powers(id) null,
                   custom_name text, custom_level smallint, custom_summary text,
                   granted_by_narrator_id uuid references profiles(id) null,
                   source_reference text, created_at)
  -- power_ref_id preenchido quando vem do catálogo verified_from_source;
  -- custom_* preenchido só quando granted_by_narrator_id não é nulo (ADR 0008)
character_advantages (id, character_id, kind 'merit'|'background', ref_id, custom_label, dots smallint, source 'base_budget'|'predator_type'|'xp')
character_flaws (id, character_id, ref_id, custom_label, dots smallint, source)
character_convictions (id, character_id, label text, order smallint)
character_touchstones (id, character_id, conviction_id references character_convictions(id), name text, bond text, meaning text, status text, is_private boolean default true)
character_tracks (character_id PK, health_max, health_superficial, health_aggravated,
                   willpower_max, willpower_superficial, willpower_aggravated,
                   humanity smallint, hunger smallint check 0..5, blood_potency smallint)
```

Saúde e Força de Vontade guardam **dano superficial e agravado separadamente** (não um contador único) — exigência explícita do documento mestre.

## 3. Progressão, revisão e auditoria

```
xp_ledger (id, character_id, delta integer, reason text, category text, approved_by uuid null, applied_at, created_by uuid)
character_revisions (id, character_id, snapshot jsonb, reason 'creation_approved'|'xp_applied'|'narrator_edit', created_by, created_at)
review_events (id, character_id, reviewer_id, action 'submitted'|'approved'|'changes_requested'|'published', comment text, created_at)
audit_events (id, actor_id, character_id null, chronicle_id null, action text, justification text, payload jsonb, created_at)
```

`character_revisions.snapshot` é o congelamento pós-aprovação citado no documento mestre (etapa 9) — gerado dentro da mesma função `approve_character` (ADR 0007), nunca calculado no client.

**Correção de Fase C**: `created_by`/`approved_by`/`reviewer_id`/`actor_id` (e `chronicle_memberships.invited_by`, `character_powers.granted_by_narrator_id`) são `ON DELETE SET NULL` para `profiles(id)`, não `NO ACTION`. Descoberto pelos testes de integração: sem isso, excluir a conta de qualquer usuário que já tivesse revisado/aprovado/arquivado **o personagem de outro jogador** ficava permanentemente bloqueado por violação de FK — a trilha em si nunca é apagada, só o vínculo com o ator deletado vira null (migration `20261116120011`).

## 4. Catálogo de referência e mídia

```
reference_clans (id, name, epithet, bane_summary, compulsion_summary, disciplines text[], source_document, source_page)
reference_disciplines (id, name, clans text[])
reference_powers (id, discipline_id, level smallint, name, summary, prerequisites text, amalgam text,
                   verification_status 'verified_from_source'|'requires_reference',  -- ADR 0001
                   source_document, source_page)
reference_advantages (id, kind 'merit'|'flaw'|'background', name, dots_min, dots_max, summary, lineage_restriction, source_document, source_page)
reference_predator_types (id, name, disciplines text[], summary, source_document, source_page)

media_assets (id, owner_id references profiles(id), character_id references characters(id) null,
              storage_path, mime_type, kind 'portrait'|'avatar'|'other', created_at)
```

Todo `reference_*` carrega `source_document`/`source_page` — nenhuma linha sem origem rastreável (ADR 0001, ADR 0005).

## 5. RLS — estratégia

Princípios (documento mestre, seção Segurança):

1. **Nunca confiar em `role` do client ou de `user_metadata`.** Toda policy que precisa saber se o usuário é narrador consulta `chronicle_memberships` com `auth.uid()`.
2. **Função helper `is_chronicle_staff(chronicle_id uuid) returns boolean`** (`SECURITY DEFINER`, `search_path` fixo) encapsula o `exists (select 1 from chronicle_memberships where user_id = auth.uid() and chronicle_id = $1 and role in ('storyteller','admin'))`, reaproveitada em todas as policies — evita duplicar a subquery (e o risco de recursão de RLS) em cada tabela.
3. **`characters`**: `select` permitido para o dono (`owner_id = auth.uid()`), para staff da crônica, e para qualquer um quando `visibility = 'public' and status = 'published'`. `insert`/`update`/`delete` só para o dono (com as transições de estado restritas pelas funções RPC, não por policy solta). Staff pode `update` apenas colunas de revisão via RPC `SECURITY DEFINER`, não via `update` direto a partir do client.
4. **`character_details` e tabelas de dados privados**: mesma regra de `select` de `characters`, mas a view pública (ou a query da galeria) seleciona explicitamente só as colunas públicas — nunca `select *`.
5. **`reference_*`**: `select` público (são compêndio, não segredo); `insert`/`update`/`delete` bloqueados para todos os roles do client — só migrations (owner do banco) escrevem.
6. **`media_assets`/Storage**: bucket privado por padrão; política de leitura de portrait só libera publicamente quando o personagem associado está `published`/`public`; upload exige dono autenticado, nome de arquivo aleatório (gerado no servidor, nunca o nome original do usuário), e validação de MIME real (não só extensão) antes do upload ser aceito.
7. Policies testadas nos quatro cenários do documento mestre: jogador A, jogador B, narrador, visitante — ver `docs/IMPLEMENTATION_PLAN.md` Fase C para o plano de testes (pgTAP ou Vitest contra Postgres local).

## 6. Paginação e índices

- `characters`: índice em `(chronicle_id, status)` para a fila do Conselho; índice em `(visibility, status, created_at desc)` para a galeria pública paginada; índice em `(owner_id)` para o dashboard.
- `xp_ledger`, `review_events`, `audit_events`: índice em `(character_id, created_at desc)` para timelines.
- Busca textual da galeria (nome, conceito, clã): começa com `ilike` indexado por `pg_trgm` no MVP; evolui para full-text search se o volume justificar.

## 7. Exclusão de conta

Ao excluir a conta (`auth.users` cascade em `profiles`): personagens `draft`/`changes_requested` são excluídos em cascata; personagens `published` são despublicados (`visibility = 'private'`, `status` permanece histórico) e o `owner_id` é preservado para auditoria do narrador, mas o perfil público (`/u/[username]`) deixa de resolver. Documentado também em `docs/LEGAL.md`.
