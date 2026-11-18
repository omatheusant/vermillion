-- Fix: no Supabase, pgcrypto é instalado no schema `extensions`, não em
-- `public` — search_path fixo (ADR 0007) não o alcança sem qualificar.
-- Descoberto pelo teste de integração RLS (fluxo submit→approve→publish).

create or replace function publish_character(p_character_id uuid)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_slug text;
begin
  select * into v_character from characters where id = p_character_id for update;
  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;
  if v_character.owner_id <> auth.uid() and not is_chronicle_staff(v_character.chronicle_id) then
    raise exception 'Sem permissão para publicar este personagem.' using errcode = '42501';
  end if;
  if v_character.status <> 'approved' then
    raise exception 'Apenas personagens aprovados podem ser publicados.' using errcode = 'P0001';
  end if;

  v_slug := coalesce(
    v_character.slug,
    lower(regexp_replace(v_character.name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(v_character.id::text, 1, 8)
  );

  perform set_config('vermillion.via_rpc', 'on', true);
  update characters
    set status = 'published',
        visibility = 'public',
        slug = v_slug,
        public_share_token = coalesce(public_share_token, encode(extensions.gen_random_bytes(16), 'hex'))
  where id = p_character_id
  returning * into v_character;

  insert into review_events (character_id, reviewer_id, action)
  values (p_character_id, auth.uid(), 'published');

  return v_character;
end;
$$;
