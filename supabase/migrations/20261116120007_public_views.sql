-- Views públicas com allowlist explícita de colunas — nunca select *.
-- security_invoker=false (default em PG15+) faz a view ler a tabela de
-- base com o privilégio do owner (bypassa RLS), mas só expõe as colunas
-- citadas aqui. Qualquer coluna privada nova precisa de decisão
-- explícita para entrar nestas views — nunca entra por acidente.

create view public_profiles as
select id, username, display_name, bio, avatar_media_id, created_at
from profiles;

grant select on public_profiles to anon, authenticated;

create view public_characters as
select
  c.id,
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
