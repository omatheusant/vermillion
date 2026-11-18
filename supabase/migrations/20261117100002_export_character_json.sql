-- build_character_snapshot (ADR 0007, Fase C) nunca teve GRANT EXECUTE
-- para authenticated nem checagem de autorização própria — ela só é
-- seguro chamada internamente por approve_character (que já confere
-- staff antes). Para a exportação JSON da Ficha Viva (Fase E, "Sua
-- primeira resposta"/critério de aceite), o personagem é dono/staff,
-- nunca público direto — um wrapper reconfirma isso antes de delegar
-- para a função original, que continua sem GRANT (defesa em
-- profundidade: mesmo que alguém descubra o nome da função interna,
-- não consegue chamá-la direto).
create or replace function export_character_json(p_character_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  select * into v_character from characters where id = p_character_id;

  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;

  if v_character.owner_id <> auth.uid() and not is_chronicle_staff(v_character.chronicle_id) then
    raise exception 'Sem permissão para exportar este personagem.' using errcode = '42501';
  end if;

  return build_character_snapshot(p_character_id);
end;
$$;

grant execute on function export_character_json(uuid) to authenticated;
