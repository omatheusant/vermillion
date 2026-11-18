-- RPCs de salvamento do wizard (etapas 2–7) — ADR 0007 (escrita
-- multi-tabela é sempre função, nunca chamadas sequenciais do client) +
-- ADR 0003 (versionamento otimista: cada chamada exige expected_version;
-- divergência recusa a escrita com P0003, nunca sobrescreve silenciosamente).
--
-- A validação de regra de domínio (distribuição exata de pontos,
-- orçamentos, etc.) roda em src/domain/v5 (TypeScript) dentro do
-- Server Action ANTES de chamar a RPC — estas funções garantem
-- atomicidade multi-tabela e autorização, não reimplementam a
-- matemática do ruleset em PL/pgSQL (ADR 0010: regras de domínio vivem
-- fora do banco). `enforce_character_lock` (trigger já existente)
-- continua bloqueando qualquer uma destas chamadas se o personagem já
-- não estiver em draft/changes_requested.

create or replace function check_character_version(p_character_id uuid, p_expected_version integer)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  select * into v_character from characters where id = p_character_id for update;

  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;

  if v_character.owner_id <> auth.uid() then
    raise exception 'Apenas o dono pode editar este personagem.' using errcode = '42501';
  end if;

  if v_character.version <> p_expected_version then
    raise exception 'Esta etapa foi salva em outro lugar enquanto você editava. Recarregue antes de continuar.'
      using errcode = 'P0003';
  end if;

  return v_character;
end;
$$;

-- Etapa 2 — Linhagem e sociedade. Mudar clã/linhagem limpa as
-- Disciplinas dependentes (confirmação fica a cargo do client antes de
-- chamar esta função) — nunca mexe em character_details (texto livre
-- nunca é descartado, master doc §Wizard).
create or replace function save_character_lineage(
  p_character_id uuid,
  p_expected_version integer,
  p_lineage character_lineage,
  p_clan_id text,
  p_sire_name text,
  p_embrace_date date
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_clan_changed boolean;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  if p_lineage <> 'clan' and p_clan_id is not null then
    raise exception 'Caitiff e Sangue-Ralo não têm clan_id.' using errcode = 'P0001';
  end if;
  if p_lineage = 'clan' and p_clan_id is null then
    raise exception 'Escolha um clã.' using errcode = 'P0001';
  end if;

  v_clan_changed := (v_character.lineage, v_character.clan_id) is distinct from (p_lineage, p_clan_id);

  update characters
    set lineage = p_lineage,
        clan_id = p_clan_id,
        version = version + 1,
        creation_step = greatest(creation_step, 2)
  where id = p_character_id
  returning * into v_character;

  update character_details
    set sire_name = p_sire_name, embrace_date = p_embrace_date
  where character_id = p_character_id;

  if v_clan_changed then
    delete from character_disciplines where character_id = p_character_id;
  end if;

  return v_character;
end;
$$;

grant execute on function save_character_lineage(uuid, integer, character_lineage, text, text, date) to authenticated;

-- Etapa 3 — Atributos.
create or replace function save_character_attributes(
  p_character_id uuid,
  p_expected_version integer,
  p_attributes jsonb
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_attributes where character_id = p_character_id;

  insert into character_attributes (character_id, attribute_id, value)
  select p_character_id, (item->>'attribute_id')::text, (item->>'value')::smallint
  from jsonb_array_elements(p_attributes) as item;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 3)
  where id = p_character_id
  returning * into v_character;

  update character_tracks
    set health_max = (select value from character_attributes where character_id = p_character_id and attribute_id = 'stamina') + 3,
        willpower_max = (select value from character_attributes where character_id = p_character_id and attribute_id = 'composure')
                       + (select value from character_attributes where character_id = p_character_id and attribute_id = 'resolve')
  where character_id = p_character_id;

  return v_character;
end;
$$;

grant execute on function save_character_attributes(uuid, integer, jsonb) to authenticated;

-- Etapa 4 — Perícias e especializações.
create or replace function save_character_skills(
  p_character_id uuid,
  p_expected_version integer,
  p_skills jsonb,
  p_specializations jsonb
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_skills where character_id = p_character_id;
  delete from character_specializations where character_id = p_character_id;

  insert into character_skills (character_id, skill_id, value)
  select p_character_id, (item->>'skill_id')::text, (item->>'value')::smallint
  from jsonb_array_elements(p_skills) as item
  where (item->>'value')::smallint > 0;

  insert into character_specializations (character_id, skill_id, label, is_free)
  select p_character_id, (item->>'skill_id')::text, (item->>'label')::text, coalesce((item->>'is_free')::boolean, false)
  from jsonb_array_elements(p_specializations) as item;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 4)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_skills(uuid, integer, jsonb, jsonb) to authenticated;

-- Etapa 5 — Disciplinas e poderes (inclui Alquimia de Sangue-Ralo,
-- ADR 0004, como uma linha com discipline_id='thin_blood_alchemy').
create or replace function save_character_disciplines(
  p_character_id uuid,
  p_expected_version integer,
  p_disciplines jsonb
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_disciplines where character_id = p_character_id;

  insert into character_disciplines (character_id, discipline_id, value, source, notes)
  select
    p_character_id,
    (item->>'discipline_id')::text,
    (item->>'value')::smallint,
    (item->>'source')::character_discipline_source,
    item->>'notes'
  from jsonb_array_elements(p_disciplines) as item;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 5)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_disciplines(uuid, integer, jsonb) to authenticated;

-- Etapa 6 — Vantagens, Defeitos e Antecedentes.
create or replace function save_character_advantages(
  p_character_id uuid,
  p_expected_version integer,
  p_merits jsonb,
  p_flaws jsonb
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_advantages where character_id = p_character_id;
  delete from character_flaws where character_id = p_character_id;

  insert into character_advantages (character_id, kind, ref_id, custom_label, dots, source)
  select
    p_character_id,
    (item->>'kind')::text,
    nullif(item->>'ref_id', '')::uuid,
    nullif(item->>'custom_label', ''),
    (item->>'dots')::smallint,
    (item->>'source')::character_advantage_source
  from jsonb_array_elements(p_merits) as item;

  insert into character_flaws (character_id, ref_id, custom_label, dots, source)
  select
    p_character_id,
    nullif(item->>'ref_id', '')::uuid,
    nullif(item->>'custom_label', ''),
    (item->>'dots')::smallint,
    (item->>'source')::character_advantage_source
  from jsonb_array_elements(p_flaws) as item;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 6)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_advantages(uuid, integer, jsonb, jsonb) to authenticated;

-- Etapa 7 — Humanidade e crenças (Convicções + Pilares).
create or replace function save_character_humanity(
  p_character_id uuid,
  p_expected_version integer,
  p_convictions jsonb,
  p_touchstones jsonb
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_old_id uuid;
  v_new_id uuid;
  v_id_map jsonb := '{}'::jsonb;
  item jsonb;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_touchstones where character_id = p_character_id;
  delete from character_convictions where character_id = p_character_id;

  for item in select * from jsonb_array_elements(p_convictions)
  loop
    v_old_id := (item->>'client_id')::uuid;
    insert into character_convictions (character_id, label, position)
    values (p_character_id, item->>'label', coalesce((item->>'position')::smallint, 0))
    returning id into v_new_id;
    v_id_map := v_id_map || jsonb_build_object(v_old_id::text, v_new_id::text);
  end loop;

  insert into character_touchstones (character_id, conviction_id, name, bond, meaning, status, is_private)
  select
    p_character_id,
    (v_id_map ->> (item->>'conviction_client_id'))::uuid,
    item->>'name',
    item->>'bond',
    item->>'meaning',
    item->>'status',
    coalesce((item->>'is_private')::boolean, true)
  from jsonb_array_elements(p_touchstones) as item;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 7)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_humanity(uuid, integer, jsonb, jsonb) to authenticated;

-- Etapa 1 — Identidade e conceito (characters.name + campos públicos de
-- character_details). Fase C deixou esta etapa como demonstração
-- visual da Fase B; esta é a persistência real.
create or replace function save_character_identity(
  p_character_id uuid,
  p_expected_version integer,
  p_name text,
  p_social_name text,
  p_apparent_age smallint,
  p_nationality text,
  p_occupation text,
  p_concept text,
  p_ambition text,
  p_desire text
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  update characters
    set name = p_name, version = version + 1, creation_step = greatest(creation_step, 1)
  where id = p_character_id
  returning * into v_character;

  update character_details
    set social_name = p_social_name,
        apparent_age = p_apparent_age,
        nationality = p_nationality,
        occupation = p_occupation,
        concept = p_concept,
        ambition = p_ambition,
        desire = p_desire
  where character_id = p_character_id;

  return v_character;
end;
$$;

grant execute on function save_character_identity(uuid, integer, text, text, smallint, text, text, text, text, text) to authenticated;

-- Etapa 8 — História, aparência e informações (público + privado de
-- character_details).
create or replace function save_character_story(
  p_character_id uuid,
  p_expected_version integer,
  p_appearance text,
  p_personality text,
  p_human_history text,
  p_embrace_account text,
  p_after_embrace text,
  p_haven_notes text,
  p_relationships text,
  p_possessions text,
  p_private_notes text
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 8)
  where id = p_character_id
  returning * into v_character;

  update character_details
    set appearance = p_appearance,
        personality = p_personality,
        human_history = p_human_history,
        embrace_account = p_embrace_account,
        after_embrace = p_after_embrace,
        haven_notes = p_haven_notes,
        relationships = p_relationships,
        possessions = p_possessions,
        private_notes = p_private_notes
  where character_id = p_character_id;

  return v_character;
end;
$$;

grant execute on function save_character_story(uuid, integer, text, text, text, text, text, text, text, text, text) to authenticated;
