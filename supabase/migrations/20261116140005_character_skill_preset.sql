-- Falta registrar qual preset de Perícia (generalista/equilibrado/
-- especialista) foi escolhido na Etapa 4 — sem isso, a validação final
-- (Etapa 9) não sabe contra qual orçamento conferir os pontos.

alter table characters add column skill_preset text;

drop function if exists save_character_skills(uuid, integer, jsonb, jsonb);

create or replace function save_character_skills(
  p_character_id uuid,
  p_expected_version integer,
  p_skill_preset text,
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
    set skill_preset = p_skill_preset, version = version + 1, creation_step = greatest(creation_step, 4)
  where id = p_character_id
  returning * into v_character;

  return v_character;
end;
$$;

grant execute on function save_character_skills(uuid, integer, text, jsonb, jsonb) to authenticated;
