-- RLS — docs/DATA_MODEL.md §5.
-- Princípio geral: nunca confiar em role do client/user_metadata; toda
-- policy de staff passa por is_chronicle_staff() (SECURITY DEFINER,
-- definida na migration de identidade).

-- Helpers reaproveitados pelas tabelas filhas de personagem — evita
-- duplicar o EXISTS em cada policy e reduz risco de recursão de RLS.
create or replace function is_character_owner_or_staff(p_character_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from characters c
    where c.id = p_character_id
      and (c.owner_id = auth.uid() or is_chronicle_staff(c.chronicle_id))
  );
$$;

create or replace function is_character_owner(p_character_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from characters c
    where c.id = p_character_id and c.owner_id = auth.uid()
  );
$$;

-- profiles: cada usuário só lê/edita a própria linha. Dados públicos de
-- perfil (/u/[username]) saem de uma view separada (public_profiles),
-- nunca desta tabela diretamente.
alter table profiles enable row level security;
create policy profiles_select_own on profiles for select using (auth.uid() = id);
create policy profiles_update_own on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- chronicles: visível só para quem é membro.
alter table chronicles enable row level security;
create policy chronicles_select_member on chronicles for select using (
  exists (select 1 from chronicle_memberships m where m.chronicle_id = chronicles.id and m.user_id = auth.uid())
);

-- chronicle_memberships: cada um vê a própria linha; staff vê todas as
-- linhas da crônica onde é staff.
alter table chronicle_memberships enable row level security;
create policy chronicle_memberships_select on chronicle_memberships for select using (
  user_id = auth.uid() or is_chronicle_staff(chronicle_id)
);

-- reference_*: compêndio público, somente leitura via client (escritas
-- só por migration, ADR 0005).
alter table reference_clans enable row level security;
create policy reference_clans_select on reference_clans for select using (true);

alter table reference_disciplines enable row level security;
create policy reference_disciplines_select on reference_disciplines for select using (true);

alter table reference_powers enable row level security;
create policy reference_powers_select on reference_powers for select using (true);

alter table reference_advantages enable row level security;
create policy reference_advantages_select on reference_advantages for select using (true);

alter table reference_predator_types enable row level security;
create policy reference_predator_types_select on reference_predator_types for select using (true);

-- characters (docs/DATA_MODEL.md §5.3): dono, staff da crônica, ou
-- qualquer um quando published+public. Insert só via RPC SECURITY
-- DEFINER (create_character_draft) — sem policy de insert aqui.
alter table characters enable row level security;

create policy characters_select on characters for select using (
  owner_id = auth.uid()
  or is_chronicle_staff(chronicle_id)
  or (visibility = 'public' and status = 'published')
);

create policy characters_update_own on characters for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy characters_delete_own_draft on characters for delete
  using (owner_id = auth.uid() and status = 'draft');

-- character_details: mesma visibilidade de characters para leitura
-- (dono/staff), nunca exposta a visitantes por aqui — a galeria pública
-- usa a view public_characters (próxima migration), que seleciona só as
-- colunas públicas por nome, nunca select *.
alter table character_details enable row level security;

create policy character_details_select on character_details for select using (
  is_character_owner_or_staff(character_id)
);
create policy character_details_insert on character_details for insert with check (
  is_character_owner(character_id)
);
create policy character_details_update on character_details for update
  using (is_character_owner(character_id))
  with check (is_character_owner(character_id));

-- Tabelas filhas de personagem com o mesmo formato de CRUD
-- (select: dono ou staff; insert/update/delete: só dono). Loop num DO
-- block para manter as 10 policies idênticas auditáveis de uma só vez,
-- em vez de 40 statements quase duplicados.
do $$
declare
  t text;
begin
  foreach t in array array[
    'character_attributes','character_skills','character_specializations',
    'character_disciplines','character_powers','character_advantages',
    'character_flaws','character_convictions','character_touchstones',
    'character_tracks','character_edit_sessions'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (is_character_owner_or_staff(character_id))', t || '_select', t);
    execute format('create policy %I on %I for insert with check (is_character_owner(character_id))', t || '_insert', t);
    execute format('create policy %I on %I for update using (is_character_owner(character_id)) with check (is_character_owner(character_id))', t || '_update', t);
    execute format('create policy %I on %I for delete using (is_character_owner(character_id))', t || '_delete', t);
  end loop;
end;
$$;

-- xp_ledger / character_revisions / review_events: só leitura de
-- dono/staff; toda escrita é via RPC SECURITY DEFINER (ADR 0007), nunca
-- insert direto do client — "nunca subtrair XP apenas no client".
alter table xp_ledger enable row level security;
create policy xp_ledger_select on xp_ledger for select using (is_character_owner_or_staff(character_id));

alter table character_revisions enable row level security;
create policy character_revisions_select on character_revisions for select using (is_character_owner_or_staff(character_id));

alter table review_events enable row level security;
create policy review_events_select on review_events for select using (is_character_owner_or_staff(character_id));

-- audit_events: visível para quem agiu, ou staff da crônica/personagem
-- relacionado. Sem insert direto do client (sempre via RPC).
alter table audit_events enable row level security;
create policy audit_events_select on audit_events for select using (
  actor_id = auth.uid()
  or (chronicle_id is not null and is_chronicle_staff(chronicle_id))
  or (character_id is not null and is_character_owner_or_staff(character_id))
);

-- media_assets: dono vê e gerencia os próprios; staff e público também
-- veem quando o personagem associado está published+public (necessário
-- para exibir retrato na galeria).
alter table media_assets enable row level security;
create policy media_assets_select on media_assets for select using (
  owner_id = auth.uid()
  or (character_id is not null and is_character_owner_or_staff(character_id))
  or (character_id is not null and exists (
    select 1 from characters c
    where c.id = media_assets.character_id and c.visibility = 'public' and c.status = 'published'
  ))
);
create policy media_assets_insert on media_assets for insert with check (owner_id = auth.uid());
create policy media_assets_delete on media_assets for delete using (owner_id = auth.uid());
