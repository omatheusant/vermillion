-- Fix: parâmetros opcionais/nulos das RPCs de wizard precisam de
-- `default null` para o gerador de tipos do Supabase CLI marcá-los
-- como nullable/opcionais no TypeScript — sem isso, `save_character_*`
-- recusava `null` em text/smallint/date em tempo de typecheck mesmo
-- sendo um valor válido para essas colunas.

create or replace function save_character_lineage(
  p_character_id uuid,
  p_expected_version integer,
  p_lineage character_lineage,
  p_clan_id text default null,
  p_sire_name text default null,
  p_embrace_date date default null
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

create or replace function save_character_identity(
  p_character_id uuid,
  p_expected_version integer,
  p_name text,
  p_social_name text default null,
  p_apparent_age smallint default null,
  p_nationality text default null,
  p_occupation text default null,
  p_concept text default null,
  p_ambition text default null,
  p_desire text default null
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

create or replace function save_character_story(
  p_character_id uuid,
  p_expected_version integer,
  p_appearance text default null,
  p_personality text default null,
  p_human_history text default null,
  p_embrace_account text default null,
  p_after_embrace text default null,
  p_haven_notes text default null,
  p_relationships text default null,
  p_possessions text default null,
  p_private_notes text default null
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
