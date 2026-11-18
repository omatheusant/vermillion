-- Seita/afiliação política (master doc §"Seitas/afiliação política")
-- faltava uma coluna própria — opcional, nunca forçada por clã,
-- nunca concede bônus automático (só dado narrativo/político no MVP).

create type character_sect as enum ('camarilla', 'anarch', 'sabbat', 'ashirra', 'independent');

alter table characters add column sect character_sect;

-- save_character_lineage ganha p_sect — salva junto na mesma etapa
-- (dado narrativo/político, nunca bônus automático nem obrigatório).
-- drop explícito porque adicionar um parâmetro muda a assinatura —
-- "create or replace" não substitui, só sobrecarregaria a função.
drop function if exists save_character_lineage(uuid, integer, character_lineage, text, text, date);

create or replace function save_character_lineage(
  p_character_id uuid,
  p_expected_version integer,
  p_lineage character_lineage,
  p_clan_id text default null,
  p_sire_name text default null,
  p_embrace_date date default null,
  p_sect character_sect default null
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
        sect = p_sect,
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

grant execute on function save_character_lineage(uuid, integer, character_lineage, text, text, date, character_sect) to authenticated;
