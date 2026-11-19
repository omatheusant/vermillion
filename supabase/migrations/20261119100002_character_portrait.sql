-- Retrato do personagem — docs/DATA_MODEL.md §5.6/§6 já previa
-- media_assets.kind='portrait' e media_assets.character_id desde a Fase A
-- (migration 20261116120005); só faltava o campo em character_details, a
-- RPC (ADR 0007 — toca media_assets + character_details numa transação só,
-- nunca duas chamadas sequenciais do client) e a policy de Storage.

alter table character_details
  add column portrait_media_id uuid references media_assets(id) on delete set null;

-- ADR 0007 + ADR 0003 (mesmo padrão de check_character_version dos demais
-- RPCs de etapa, wizard_step_rpcs.sql): o upload do arquivo para o Storage
-- já aconteceu no client/action antes desta chamada (precisa do
-- storage_path para existir); esta função só grava o media_assets e liga
-- character_details.portrait_media_id numa transação atômica.
create or replace function save_character_portrait(
  p_character_id uuid,
  p_expected_version integer,
  p_storage_path text,
  p_mime_type text
)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_media_id uuid;
begin
  v_character := check_character_version(p_character_id, p_expected_version);

  insert into media_assets (owner_id, character_id, storage_path, mime_type, kind)
  values (auth.uid(), p_character_id, p_storage_path, p_mime_type, 'portrait')
  returning id into v_media_id;

  update characters
    set version = version + 1
  where id = p_character_id
  returning * into v_character;

  update character_details
    set portrait_media_id = v_media_id
  where character_id = p_character_id;

  return v_character;
end;
$$;

grant execute on function save_character_portrait(uuid, integer, text, text) to authenticated;

-- Leitura de retrato no Storage (bucket `media`, política já restrita ao
-- dono em 20261116120009_storage.sql): além do dono, também pode ler quem é
-- staff da crônica do personagem (Conselho) ou qualquer usuário autenticado
-- quando o personagem associado já está published+public — exatamente o
-- que docs/DATA_MODEL.md §6 previa ("leitura de portrait só libera
-- publicamente quando published/public") e nunca tinha sido implementado.
create policy media_storage_select_portrait on storage.objects for select
  using (
    bucket_id = 'media'
    and exists (
      select 1
      from media_assets ma
      join characters c on c.id = ma.character_id
      where ma.storage_path = storage.objects.name
        and ma.kind = 'portrait'
        and (
          c.owner_id = auth.uid()
          or is_chronicle_staff(c.chronicle_id)
          or (c.status = 'published' and c.visibility = 'public')
        )
    )
  );
