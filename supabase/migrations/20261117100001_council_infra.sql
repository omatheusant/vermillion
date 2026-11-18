-- Infraestrutura do Conselho — Fase E.
-- 1) Config de crônica editável só por staff, com guarda explícita
--    contra a chave proibida "max_active_characters" (ADR 0002: o teto
--    de 3 é fixo no schema, nunca configurável pela crônica).
-- 2) RPC de concessão pontual de poder não verificado (ADR 0008).
-- 3) public_characters ganha owner_id (só o id, nunca o username/role
--    direto) para o perfil público /u/[username] conseguir filtrar os
--    personagens publicados de um dono sem reconsultar characters.

create or replace function enforce_chronicle_settings_shape()
returns trigger
language plpgsql
as $$
begin
  if new.settings ? 'max_active_characters' then
    raise exception 'O teto de personagens ativos é fixo em 3 (ADR 0002) — não é uma configuração de crônica.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_chronicle_settings_shape
  before insert or update of settings on chronicles
  for each row execute function enforce_chronicle_settings_shape();

create policy chronicles_update_staff on chronicles for update
  using (is_chronicle_staff(id))
  with check (is_chronicle_staff(id));

-- Concessão pontual de poder não verificado — só narrador/admin, só
-- antes da aprovação (ADR 0008), sempre com fonte e vínculo de auditoria.
create or replace function grant_narrator_power(
  p_character_id uuid,
  p_discipline_id text,
  p_custom_name text,
  p_custom_level smallint,
  p_custom_summary text,
  p_source_reference text
)
returns character_powers
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_power character_powers;
begin
  select * into v_character from characters where id = p_character_id for update;

  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;

  if not is_chronicle_staff(v_character.chronicle_id) then
    raise exception 'Apenas narradores podem conceder poderes não verificados.' using errcode = '42501';
  end if;

  if v_character.status not in ('submitted', 'changes_requested') then
    raise exception 'Concessão pontual só vale antes da aprovação (submitted/changes_requested).'
      using errcode = 'P0001';
  end if;

  if p_custom_name is null or length(trim(p_custom_name)) = 0 then
    raise exception 'Nome do poder é obrigatório.' using errcode = 'P0001';
  end if;
  if p_source_reference is null or length(trim(p_source_reference)) = 0 then
    raise exception 'Referência de fonte é obrigatória (ADR 0008).' using errcode = 'P0001';
  end if;

  insert into character_powers (character_id, discipline_id, custom_name, custom_level, custom_summary, granted_by_narrator_id, source_reference)
  values (p_character_id, p_discipline_id, p_custom_name, p_custom_level, p_custom_summary, auth.uid(), p_source_reference)
  returning * into v_power;

  insert into audit_events (actor_id, character_id, chronicle_id, action, justification, payload)
  values (
    auth.uid(),
    p_character_id,
    v_character.chronicle_id,
    'narrator_power_grant',
    'Concessão pontual de poder não verificado (ADR 0008).',
    jsonb_build_object('discipline_id', p_discipline_id, 'custom_name', p_custom_name, 'source_reference', p_source_reference)
  );

  return v_power;
end;
$$;

grant execute on function grant_narrator_power(uuid, text, text, smallint, text, text) to authenticated;

drop view public_characters;

create view public_characters as
select
  c.id,
  c.owner_id,
  c.slug,
  c.public_share_token,
  c.name,
  c.clan_id,
  c.lineage,
  c.visibility,
  c.status,
  c.created_at,
  d.social_name,
  d.apparent_age,
  d.nationality,
  d.occupation,
  d.concept,
  d.ambition,
  d.desire,
  d.appearance,
  d.personality
from characters c
join character_details d on d.character_id = c.id
where c.visibility = 'public' and c.status = 'published';

grant select on public_characters to anon, authenticated;
