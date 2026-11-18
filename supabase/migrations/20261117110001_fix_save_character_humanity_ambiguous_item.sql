-- Fix: save_character_humanity falhava sempre que havia ao menos 1 Pilar,
-- com "column reference 'item' is ambiguous" — a variável plpgsql `item`
-- (usada no loop de Convicções) colidia com o alias `item` da consulta de
-- Pilares. Encontrado pelo E2E da jornada crítica (Fase F).
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
  v_conviction jsonb;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  delete from character_touchstones where character_id = p_character_id;
  delete from character_convictions where character_id = p_character_id;

  for v_conviction in select * from jsonb_array_elements(p_convictions)
  loop
    v_old_id := (v_conviction->>'client_id')::uuid;
    insert into character_convictions (character_id, label, position)
    values (p_character_id, v_conviction->>'label', coalesce((v_conviction->>'position')::smallint, 0))
    returning id into v_new_id;
    v_id_map := v_id_map || jsonb_build_object(v_old_id::text, v_new_id::text);
  end loop;

  insert into character_touchstones (character_id, conviction_id, name, bond, meaning, status, is_private)
  select
    p_character_id,
    (v_id_map ->> (touchstone->>'conviction_client_id'))::uuid,
    touchstone->>'name',
    touchstone->>'bond',
    touchstone->>'meaning',
    touchstone->>'status',
    coalesce((touchstone->>'is_private')::boolean, true)
  from jsonb_array_elements(p_touchstones) as touchstone;

  update characters
    set version = version + 1, creation_step = greatest(creation_step, 7)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_humanity(uuid, integer, jsonb, jsonb) to authenticated;
