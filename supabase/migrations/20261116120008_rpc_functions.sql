-- Operações compostas via função Postgres transacional — ADR 0007.
-- Toda função revalida auth.uid()/papel internamente (defesa em
-- profundidade), mesmo que RLS já deva bloquear o caminho errado.

create or replace function build_character_snapshot(p_character_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'character', to_jsonb(c.*),
    'details', to_jsonb(d.*),
    'attributes', coalesce((select jsonb_agg(to_jsonb(a.*)) from character_attributes a where a.character_id = p_character_id), '[]'::jsonb),
    'skills', coalesce((select jsonb_agg(to_jsonb(s.*)) from character_skills s where s.character_id = p_character_id), '[]'::jsonb),
    'specializations', coalesce((select jsonb_agg(to_jsonb(sp.*)) from character_specializations sp where sp.character_id = p_character_id), '[]'::jsonb),
    'disciplines', coalesce((select jsonb_agg(to_jsonb(di.*)) from character_disciplines di where di.character_id = p_character_id), '[]'::jsonb),
    'powers', coalesce((select jsonb_agg(to_jsonb(p.*)) from character_powers p where p.character_id = p_character_id), '[]'::jsonb),
    'advantages', coalesce((select jsonb_agg(to_jsonb(av.*)) from character_advantages av where av.character_id = p_character_id), '[]'::jsonb),
    'flaws', coalesce((select jsonb_agg(to_jsonb(f.*)) from character_flaws f where f.character_id = p_character_id), '[]'::jsonb),
    'convictions', coalesce((select jsonb_agg(to_jsonb(cv.*)) from character_convictions cv where cv.character_id = p_character_id), '[]'::jsonb),
    'touchstones', coalesce((select jsonb_agg(to_jsonb(ts.*)) from character_touchstones ts where ts.character_id = p_character_id), '[]'::jsonb),
    'tracks', to_jsonb(tr.*)
  )
  from characters c
  left join character_details d on d.character_id = c.id
  left join character_tracks tr on tr.character_id = c.id
  where c.id = p_character_id;
$$;

-- Criação de rascunho real: valida membership na crônica, insere
-- characters + details + tracks vazios na mesma transação. A atribuição
-- de slot (e o erro de limite atingido) acontece no trigger
-- assign_character_slot, disparado pelo INSERT abaixo.
create or replace function create_character_draft(p_chronicle_id uuid, p_name text)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_is_member boolean;
begin
  if auth.uid() is null then
    raise exception 'Autenticação necessária.' using errcode = '28000';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Nome do personagem é obrigatório.' using errcode = 'P0001';
  end if;

  select exists(
    select 1 from chronicle_memberships
    where chronicle_id = p_chronicle_id and user_id = auth.uid()
  ) into v_is_member;

  if not v_is_member then
    raise exception 'Você não participa desta crônica.' using errcode = '42501';
  end if;

  insert into characters (owner_id, chronicle_id, name)
  values (auth.uid(), p_chronicle_id, trim(p_name))
  returning * into v_character;

  insert into character_details (character_id) values (v_character.id);
  insert into character_tracks (character_id) values (v_character.id);

  return v_character;
end;
$$;

grant execute on function create_character_draft(uuid, text) to authenticated;

create or replace function submit_character_for_review(p_character_id uuid)
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
    raise exception 'Apenas o dono pode enviar para avaliação.' using errcode = '42501';
  end if;
  if v_character.status not in ('draft','changes_requested') then
    raise exception 'Personagem não está em um estado que permita envio.' using errcode = 'P0001';
  end if;

  perform set_config('vermillion.via_rpc', 'on', true);
  update characters set status = 'submitted' where id = p_character_id returning * into v_character;

  insert into review_events (character_id, reviewer_id, action)
  values (p_character_id, auth.uid(), 'submitted');

  return v_character;
end;
$$;

grant execute on function submit_character_for_review(uuid) to authenticated;

create or replace function approve_character(p_character_id uuid, p_comment text default null)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
  v_snapshot jsonb;
begin
  select * into v_character from characters where id = p_character_id for update;
  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;
  if not is_chronicle_staff(v_character.chronicle_id) then
    raise exception 'Apenas narradores podem aprovar.' using errcode = '42501';
  end if;
  if v_character.status <> 'submitted' then
    raise exception 'Personagem não está em avaliação.' using errcode = 'P0001';
  end if;

  v_snapshot := build_character_snapshot(p_character_id);

  perform set_config('vermillion.via_rpc', 'on', true);
  update characters set status = 'approved' where id = p_character_id returning * into v_character;

  insert into review_events (character_id, reviewer_id, action, comment)
  values (p_character_id, auth.uid(), 'approved', p_comment);

  insert into character_revisions (character_id, snapshot, reason, created_by)
  values (p_character_id, v_snapshot, 'creation_approved', auth.uid());

  return v_character;
end;
$$;

grant execute on function approve_character(uuid, text) to authenticated;

create or replace function request_character_changes(p_character_id uuid, p_comment text)
returns characters
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_character characters;
begin
  if p_comment is null or length(trim(p_comment)) = 0 then
    raise exception 'Comentário é obrigatório para solicitar ajustes.' using errcode = 'P0001';
  end if;

  select * into v_character from characters where id = p_character_id for update;
  if v_character is null then
    raise exception 'Personagem não encontrado.' using errcode = 'P0002';
  end if;
  if not is_chronicle_staff(v_character.chronicle_id) then
    raise exception 'Apenas narradores podem solicitar ajustes.' using errcode = '42501';
  end if;
  if v_character.status <> 'submitted' then
    raise exception 'Personagem não está em avaliação.' using errcode = 'P0001';
  end if;

  perform set_config('vermillion.via_rpc', 'on', true);
  update characters set status = 'changes_requested' where id = p_character_id returning * into v_character;

  insert into review_events (character_id, reviewer_id, action, comment)
  values (p_character_id, auth.uid(), 'changes_requested', p_comment);

  return v_character;
end;
$$;

grant execute on function request_character_changes(uuid, text) to authenticated;

-- Publicação (docs §"Componente de publicação"): dono ou staff podem
-- publicar um personagem já approved. Gera slug e public_share_token
-- (identificador longo/imprevisível, não o slug) na primeira publicação.
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
        public_share_token = coalesce(public_share_token, encode(gen_random_bytes(16), 'hex'))
  where id = p_character_id
  returning * into v_character;

  insert into review_events (character_id, reviewer_id, action)
  values (p_character_id, auth.uid(), 'published');

  return v_character;
end;
$$;

grant execute on function publish_character(uuid) to authenticated;

-- Arquivamento é transição terminal (ADR 0006): sempre libera o slot
-- (trigger assign_character_slot cuida disso), nunca desfaz.
create or replace function archive_character(p_character_id uuid)
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
    raise exception 'Apenas o dono pode arquivar.' using errcode = '42501';
  end if;
  if v_character.status = 'archived' then
    raise exception 'Personagem já está arquivado.' using errcode = 'P0001';
  end if;

  perform set_config('vermillion.via_rpc', 'on', true);
  update characters set status = 'archived' where id = p_character_id returning * into v_character;

  insert into audit_events (actor_id, character_id, chronicle_id, action, justification)
  values (auth.uid(), p_character_id, v_character.chronicle_id, 'character_archived', 'Arquivamento pelo dono — transição terminal (ADR 0006).');

  return v_character;
end;
$$;

grant execute on function archive_character(uuid) to authenticated;
